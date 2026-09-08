import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
// @ts-ignore
import itHyphen from 'hyphen/it';
import { Character, WorldEntry } from '../../types';
import { searchHighlightPluginKey, currentSearchMatches } from './SearchHighlightExtension';

export const hyphenationPluginKey = new PluginKey('folia-hyphenation');

export interface HyphenationOptions {
  getEnabled: () => boolean;
  getCharacters?: () => Character[];
  getWorldbuilding?: () => WorldEntry[];
}

export const HyphenationExtension = Extension.create<HyphenationOptions>({
  name: 'foliaHyphenation',

  addOptions() {
    return {
      getEnabled: () => false,
      getCharacters: () => [],
      getWorldbuilding: () => [],
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: hyphenationPluginKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldSet, _oldState, newState) {
            const meta = tr.getMeta(hyphenationPluginKey);
            const searchMeta = tr.getMeta(searchHighlightPluginKey);
            const isEnabled = extension.options.getEnabled();

            if (!isEnabled) {
              return DecorationSet.empty;
            }

            if (!tr.docChanged && meta === undefined && searchMeta === undefined && oldSet !== DecorationSet.empty) {
              return oldSet.map(tr.mapping, tr.doc);
            }

            const decorations: Decoration[] = [];
            const doc = newState.doc;

            // Collect all character and worldbuilding entity names to exclude from being chopped by hyphenation
            const characters = extension.options.getCharacters ? extension.options.getCharacters() : [];
            const worldbuilding = extension.options.getWorldbuilding ? extension.options.getWorldbuilding() : [];
            const entityNames: string[] = [];

            characters.forEach(c => {
              if (c.name && c.name.trim().length >= 2) entityNames.push(c.name.trim());
              if (c.alias && c.alias.trim().length >= 2) entityNames.push(c.alias.trim());
            });
            worldbuilding.forEach(w => {
              if (w.name && w.name.trim().length >= 2) entityNames.push(w.name.trim());
            });

            // Sort descending so longer names match first
            entityNames.sort((a, b) => b.length - a.length);

            doc.descendants((node, pos) => {
              if (!node.isText || !node.text || node.text.length < 5) return;

              const text = node.text;

              // Find any entity ranges in this text node that must remain intact
              const excludedRanges: Array<[number, number]> = [];
              if (entityNames.length > 0) {
                entityNames.forEach(name => {
                  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  const regex = new RegExp(`(?<=^|[\\s.,;!?:'"«»()—–])${escaped}(?=[\\s.,;!?:'"«»()—–]|$)`, 'gi');
                  let m;
                  while ((m = regex.exec(text)) !== null) {
                    excludedRanges.push([m.index, m.index + m[0].length]);
                  }
                });
              }

              try {
                const hyphenated: string = itHyphen.hyphenateSync(text);
                let origIndex = 0;

                for (let i = 0; i < hyphenated.length; i++) {
                  if (hyphenated[i] === '\u00AD') {
                    const docPos = pos + origIndex;
                    // Do not insert hyphenation widget inside an entity mention or search match
                    const isInsideEntity = excludedRanges.some(([start, end]) => origIndex > start && origIndex < end);
                    const isInsideSearchMatch = currentSearchMatches.some(m => docPos >= m.from && docPos <= m.to);
                    if (!isInsideEntity && !isInsideSearchMatch) {
                      decorations.push(
                        Decoration.widget(
                          docPos,
                          () => document.createTextNode('\u00AD'),
                          { side: -1, key: `shy-${docPos}` }
                        )
                      );
                    }
                  } else {
                    origIndex++;
                  }
                }
              } catch {
                // Ignore any hyphenation error on special symbols
              }
            });

            return DecorationSet.create(doc, decorations);
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
