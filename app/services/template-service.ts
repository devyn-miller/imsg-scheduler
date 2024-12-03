import { SecurityService } from './security-service';

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
  placeholders: string[];
  lastUsed?: string;
  isShared?: boolean;
}

export class TemplateService {
  private static readonly TEMPLATES_KEY = 'message_templates';
  private static readonly CATEGORIES_KEY = 'template_categories';

  static async saveTemplate(template: MessageTemplate): Promise<void> {
    const templates = await this.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }

    await SecurityService.encryptAndStore(this.TEMPLATES_KEY, templates);
    await this.updateCategories(template.category);
  }

  static async getTemplates(): Promise<MessageTemplate[]> {
    try {
      const templates = await SecurityService.retrieveAndDecrypt(this.TEMPLATES_KEY);
      return templates || [];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const categories = await SecurityService.retrieveAndDecrypt(this.CATEGORIES_KEY);
      return categories || ['personal', 'business', 'celebrations'];
    } catch (error) {
      console.error('Error getting categories:', error);
      return ['personal', 'business', 'celebrations'];
    }
  }

  private static async updateCategories(newCategory: string): Promise<void> {
    const categories = await this.getCategories();
    if (!categories.includes(newCategory)) {
      categories.push(newCategory);
      await SecurityService.encryptAndStore(this.CATEGORIES_KEY, categories);
    }
  }

  static async exportTemplates(): Promise<string> {
    const templates = await this.getTemplates();
    const exportData = {
      version: '1.0',
      templates: templates.filter(t => t.isShared),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportData);
  }

  static async importTemplates(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);
      if (importData.version !== '1.0') return false;

      const currentTemplates = await this.getTemplates();
      const newTemplates = importData.templates.filter(
        (template: MessageTemplate) => 
          !currentTemplates.some(t => t.id === template.id)
      );

      await SecurityService.encryptAndStore(
        this.TEMPLATES_KEY, 
        [...currentTemplates, ...newTemplates]
      );
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  static parsePlaceholders(content: string): string[] {
    const regex = /\{([^}]+)\}/g;
    const matches = content.match(regex) || [];
    return matches.map(match => match.slice(1, -1));
  }
}