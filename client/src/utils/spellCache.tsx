import { dndApi } from './dndApi';

interface CachedSpell {
  name: string;
  level: number;
  school: {
    name: string;
  };
  desc: string[];
  classes: {
    name: string;
  }[];
  index: string;
}

class SpellCache {
  private cache: Map<string, CachedSpell> = new Map();

  private formatSpellIndex(spellName: string): string {
    return spellName
      .toLowerCase()
      // Replace specific spell name patterns
      .replace(/\//g, '-') // Replace "/" with "-"
      .replace(/[']/g, '') // Remove apostrophes
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[()]/g, '') // Remove parentheses
      .trim();
  }

  async getSpell(spellName: string): Promise<CachedSpell | null> {
    // Check cache first
    const cachedSpell = this.cache.get(spellName);
    if (cachedSpell) {
      return cachedSpell;
    }

    try {
      // Convert spell name to API index format
      const spellIndex = this.formatSpellIndex(spellName);
      console.log('Fetching spell:', spellIndex);

      // Add a small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Add type assertion here
      const response = await dndApi.getSpell(spellIndex);
      
      // Validate the response has the required properties
      if (this.isValidSpell(response)) {
        const spell: CachedSpell = {
          name: response.name,
          level: response.level,
          school: response.school,
          desc: response.desc,
          classes: response.classes,
          index: response.index
        };
        this.cache.set(spellName, spell);
        return spell;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching spell ${spellName}:`, error);
      return null;
    }
  }

  // Type guard to validate spell response
  private isValidSpell(spell: any): spell is CachedSpell {
    return (
      spell &&
      typeof spell.name === 'string' &&
      typeof spell.level === 'number' &&
      spell.school &&
      typeof spell.school.name === 'string' &&
      Array.isArray(spell.desc) &&
      Array.isArray(spell.classes) &&
      typeof spell.index === 'string'
    );
  }

  async getMultipleSpells(spellNames: string[]): Promise<Map<string, CachedSpell>> {
    const results = new Map<string, CachedSpell>();
    
    await Promise.all(
      spellNames.map(async (name) => {
        const spell = await this.getSpell(name);
        if (spell) {
          results.set(name, spell);
        }
      })
    );

    return results;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const spellCache = new SpellCache();