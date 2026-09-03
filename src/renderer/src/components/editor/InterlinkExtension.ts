import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Character, WorldEntry } from '../../types';

export interface InterlinkOptions {
  getCharacters: () => Character[];
  getWorldbuilding: () => WorldEntry[];
}

export const interlinkPluginKey = new PluginKey('folia-interlinks');

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const InterlinkExtension = Extension.create<InterlinkOptions>({
  name: 'foliaInterlinks',

  addOptions() {
    return {
      getCharacters: () => [],
      getWorldbuilding: () => [],
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: interlinkPluginKey,
        state: {
          init(_, { doc }) {
            return findDecorations(doc, extension.options);
          },
          apply(tr, oldSet, _, newState) {
            if (tr.docChanged || tr.getMeta(interlinkPluginKey)) {
              return findDecorations(newState.doc, extension.options);
            }
            return oldSet.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

function findDecorations(doc: any, options: InterlinkOptions): DecorationSet {
  const decorations: Decoration[] = [];
  const characters = options.getCharacters();
  const worldbuilding = options.getWorldbuilding();

  // Collect entities with names of length >= 2
  const entities: Array<{
    name: string;
    type: 'character' | 'world';
    id: string;
    alias?: string;
  }> = [];

  characters.forEach(c => {
    if (c.name && c.name.trim().length >= 2) {
      entities.push({ name: c.name.trim(), type: 'character', id: c.id });
    }
    if (c.alias && c.alias.trim().length >= 2 && c.alias.trim().toLowerCase() !== c.name.trim().toLowerCase()) {
      entities.push({ name: c.alias.trim(), type: 'character', id: c.id });
    }
  });

  worldbuilding.forEach(w => {
    if (w.name && w.name.trim().length >= 2) {
      entities.push({ name: w.name.trim(), type: 'world', id: w.id });
    }
  });

  if (entities.length === 0) {
    return DecorationSet.empty;
  }

  // Sort by length descending so longer compound names match first
  entities.sort((a, b) => b.name.length - a.name.length);

  doc.descendants((node: any, pos: number) => {
    if (!node.isText) return;

    const text = node.text || '';

    entities.forEach(entity => {
      const escaped = escapeRegExp(entity.name);
      // Match whole word boundaries (supporting Unicode accents and letters)
      const regex = new RegExp(`(?<=^|[\\s.,;!?:'"«»()—–])${escaped}(?=[\\s.,;!?:'"«»()—–]|$)`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        const from = pos + match.index;
        const to = from + match[0].length;

        decorations.push(
          Decoration.inline(from, to, {
            class: `folia-interlink folia-interlink-${entity.type}`,
            'data-entity-type': entity.type,
            'data-entity-id': entity.id,
            'data-entity-name': entity.name,
          })
        );
      }
    });
  });

  return DecorationSet.create(doc, decorations);
}
