import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface SearchMatch {
  from: number;
  to: number;
}

export interface SearchHighlightState {
  matches: SearchMatch[];
  currentIndex: number;
}

export let currentSearchMatches: SearchMatch[] = [];

export const searchHighlightPluginKey = new PluginKey<SearchHighlightState>('folia-search-highlight');

export const SearchHighlightExtension = Extension.create({
  name: 'foliaSearchHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin<SearchHighlightState>({
        key: searchHighlightPluginKey,
        state: {
          init() {
            currentSearchMatches = [];
            return { matches: [], currentIndex: -1 };
          },
          apply(tr, prev) {
            const meta = tr.getMeta(searchHighlightPluginKey);
            if (meta !== undefined) {
              currentSearchMatches = meta.matches || [];
              return meta;
            }
            if (tr.docChanged && prev.matches.length > 0) {
              const mappedMatches = prev.matches
                .map(m => ({
                  from: tr.mapping.map(m.from),
                  to: tr.mapping.map(m.to)
                }))
                .filter(m => m.from < m.to);
              currentSearchMatches = mappedMatches;
              return { ...prev, matches: mappedMatches };
            }
            return prev;
          }
        },
        props: {
          decorations(state) {
            const pluginState = searchHighlightPluginKey.getState(state);
            if (!pluginState || !pluginState.matches || pluginState.matches.length === 0) {
              return DecorationSet.empty;
            }

            const { matches, currentIndex } = pluginState;
            const decorations: Decoration[] = [];

            matches.forEach((m, idx) => {
              if (m.from >= m.to || m.to > state.doc.content.size) return;
              const isActive = idx === currentIndex;
              decorations.push(
                Decoration.inline(m.from, m.to, {
                  class: isActive 
                    ? 'folia-search-match folia-search-match-active' 
                    : 'folia-search-match',
                  'data-search-idx': String(idx)
                })
              );
            });

            return DecorationSet.create(state.doc, decorations);
          }
        }
      })
    ];
  }
});
