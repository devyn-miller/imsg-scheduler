import { Observable } from '@nativescript/core';
import { MessageTemplate, TemplateService } from '../services/template-service';

export class TemplateListViewModel extends Observable {
  private _templates: MessageTemplate[] = [];
  private _searchQuery: string = '';

  constructor() {
    super();
    this.loadTemplates();
  }

  async loadTemplates() {
    try {
      this._templates = await TemplateService.getTemplates();
      if (this._templates.length === 0) {
        this._templates = TemplateService.getDefaultTemplates();
        await Promise.all(
          this._templates.map(template => TemplateService.saveTemplate(template))
        );
      }
      this.notifyPropertyChange('templates', this._templates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }

  showTemplateForm() {
    // Navigate to template form
  }

  useTemplate(args: any) {
    const template = args.object.bindingContext as MessageTemplate;
    // Emit event or use callback to populate message compose form
  }

  get templates(): MessageTemplate[] {
    if (!this._searchQuery) {
      return this._templates;
    }
    return this._templates.filter(t => 
      t.name.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(this._searchQuery.toLowerCase())
    );
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.notifyPropertyChange('templates', this.templates);
    }
  }
}