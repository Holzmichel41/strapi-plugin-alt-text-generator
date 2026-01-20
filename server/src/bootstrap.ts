import type { Core } from '@strapi/strapi';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PLUGIN_NAME = 'strapi-plugin-alt-text-generator';
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

interface FileResult {
  id: number;
  mime: string;
  url: string;
  alternativeText?: string;
}

const readFileAsBase64 = async (
  strapi: Core.Strapi,
  fileUrl: string,
  mimeType?: string
): Promise<string> => {
  const localPath = fileUrl.startsWith('/uploads/') ? `uploads${fileUrl.slice(8)}` : fileUrl;
  const absolutePath = path.isAbsolute(localPath)
    ? localPath
    : path.join(strapi.dirs.static.public, localPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Image file not found: ${absolutePath}`);
  }

  const isSvg = mimeType === 'image/svg+xml' || absolutePath.toLowerCase().endsWith('.svg');

  if (isSvg) {
    const imageBuffer = fs.readFileSync(absolutePath);
    const base64Image = imageBuffer.toString('base64');
    return `data:image/svg+xml;base64,${base64Image}`;
  }

  const image = sharp(absolutePath);
  const metadata = await image.metadata();

  const maxDimension = 1024;
  const needsResize =
    metadata.width && metadata.height
      ? metadata.width > maxDimension || metadata.height > maxDimension
      : false;

  let processedImage = image;

  if (needsResize) {
    processedImage = processedImage.resize(maxDimension, maxDimension, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const optimizedBuffer = await processedImage
    .jpeg({ quality: 75 })
    .toBuffer();

  const base64Image = optimizedBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64Image}`;
};

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Initialize instance ID
  const store = strapi.store({ type: 'plugin', name: PLUGIN_NAME });
  const instance = (await store.get({ key: 'instance' })) as { id?: string } | null;

  if (!instance?.id) {
    const instanceId = crypto.randomUUID();
    await store.set({ key: 'instance', value: { id: instanceId } });
    strapi.log.info(`[${PLUGIN_NAME}] Generated new instance ID: ${instanceId}`);
  }

  // Subscribe to file upload lifecycle
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    async afterCreate(event) {
      const result = event.result as FileResult;

      // Only process images
      if (!IMAGE_MIME_TYPES.includes(result.mime)) {
        return;
      }

      // Skip if already has alt text
      if (result.alternativeText) {
        return;
      }

      try {
        const settingsService = strapi.plugin(PLUGIN_NAME).service('settings');
        const subscriptionService = strapi.plugin(PLUGIN_NAME).service('subscription');

        // Check if auto-tagging is enabled in settings
        const autoTaggingEnabled = await settingsService.getAutoTaggingEnabled();
        if (!autoTaggingEnabled) {
          return;
        }

        // Check if license key is configured
        const hasLicenseKey = await subscriptionService.hasLicenseKey();
        if (!hasLicenseKey) {
          strapi.log.warn(`[${PLUGIN_NAME}] Auto-tagging skipped: no license key configured`);
          return;
        }

        // Check if subscription has auto-tagging feature
        const subscription = await subscriptionService.getSubscription();
        if (!subscription.isActive || !subscription.autoTagging) {
          return;
        }

        // Generate alt text via SaaS API
        const imageBase64 = await readFileAsBase64(strapi, result.url, result.mime);
        const altText = await subscriptionService.generateAltText(imageBase64);

        // Update the file with generated alt text
        await strapi.db.query('plugin::upload.file').update({
          where: { id: result.id },
          data: { alternativeText: altText },
        });

        strapi.log.info(`[${PLUGIN_NAME}] Auto-generated alt text for file ${result.id}`);
      } catch (error) {
        strapi.log.error(`[${PLUGIN_NAME}] Auto-tagging failed for file ${result.id}:`, error);
      }
    },
  });
};

export default bootstrap;
