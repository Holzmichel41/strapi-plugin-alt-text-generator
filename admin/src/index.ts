import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    // Register the plugin
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    // Add plugin to main menu for bulk operations
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('plugin.name'),
        defaultMessage: 'Alt Text Generator',
      },
      Component: async () => {
        const { BulkPage } = await import('./pages/BulkPage');
        return BulkPage;
      },
    });

    // Add settings page
    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: getTranslation('plugin.name'),
          defaultMessage: 'Alt Text Generator',
        },
      },
      [
        {
          intlLabel: {
            id: getTranslation('settings.title'),
            defaultMessage: 'Settings',
          },
          id: 'settings',
          to: `${PLUGIN_ID}`,
          Component: async () => {
            const { SettingsPage } = await import('./pages/SettingsPage');
            return SettingsPage;
          },
        },
      ]
    );
  },

  bootstrap() {
    // Note: Strapi v5 Upload plugin doesn't expose injection zones for custom buttons
    // The bulk feature is available via the main menu instead
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
