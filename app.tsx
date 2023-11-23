/** @jsxRuntime classic */
/** @jsx h */
import Typesense from 'typesense';
import { Hit } from '@algolia/client-search';
import { HighlightResult } from '@algolia/client-search';

type Highlighted<TRecord> = TRecord & {
  _highlightResult: HighlightResult<TRecord>;
};
type ProductRecord = {
  publisher: string;
  authors: string[];
  categories: string[];
  description: string;
  free_shipping: boolean;
  hierarchicalCategories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
    lvl6?: string;
  };
  img: string;
  title: string;
  popularity: number;
  price: number;
  prince_range: string;
  sale: boolean;
  sale_price: string;
  type: string;
  url: string;
};

type WithAutocompleteAnalytics<THit> = THit & {
  __autocomplete_indexName: string;
  __autocomplete_queryID: string;
};

type ProductHit = WithAutocompleteAnalytics<Hit<ProductRecord>>;

import { Client } from 'typesense';
import {
  autocomplete,
  AutocompleteComponents,
  getAlgoliaResults,
  AutocompletePlugin
} from "@algolia/autocomplete-js";
import {
  AutocompleteInsightsApi,
  createAlgoliaInsightsPlugin,
} from "@algolia/autocomplete-plugin-algolia-insights";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import algoliasearch from "algoliasearch/lite";
import { h, Fragment } from "preact";

import "@algolia/autocomplete-theme-classic";

//const appId = "AOWXU24T0D";
//const apiKey = "1542fe0f07ca1468c1649826adc04627";
//const searchClient = algoliasearch(appId, apiKey);

type CategoryRecord = {
  value: string;
};

type CreateCategoriesPluginProps = {
  typesenseClient: Client;
};

//KATEGÓRIÁK LISTÁJA

function createCategoriesPlugin({
  typesenseClient,
}: CreateCategoriesPluginProps): AutocompletePlugin<CategoryRecord, undefined> {
  return {
    async getSources({ query }) {
      const results = await typesenseClient.collections('books').documents().search({
        q: query,
        query_by: "categories",
        sort_by: '_text_match:desc',
        prioritize_exact_match: true,
        per_page: 5,
        //group_by: 'DID',
        facet_query: `categories:${query}`,
        facet_by: "categories",
        use_cache: true,
      })  
      if(!query || query == ""){
        return [];
      }
      return [
        {
          sourceId: 'categoriesPlugin',
          getItems() {
            return results.facet_counts[0].counts;
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Kategóriák</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item, components }) {
              const link = item.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[á]/g, 'a')
                .replace(/[é]/g, 'e')
                .replace(/[í]/g, 'i')
                .replace(/[óöő]/g, 'o')
                .replace(/[úüű]/g, 'u')
                .replace(/[,"';/[{}=+`~*]/g, '');
              return (
                <a href={`https://hernadi-antikvarium.hu/kategoria/${link}`} style="color: inherit; text-decoration: none;">
                  <div className="aa-ItemWrapper">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                      <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <path fillRule="evenodd" clipRule="evenodd" d="M6 3V2C6 0.89543 6.89543 0 8 0H12C13.1046 0 14 0.89543 14 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H14C13.6357 22 13.2942 21.9026 13 21.7324C12.7058 21.9026 12.3643 22 12 22H8C7.63571 22 7.29417 21.9026 7 21.7324C6.70583 21.9026 6.36429 22 6 22H2C0.89543 22 0 21.1046 0 20V5C0 3.89543 0.89543 3 2 3H6zM6 5H2V20H6V5zM14 20H18V4H14V20zM8 2V20H12V2H8zM3 14C3 13.4477 3.44772 13 4 13C4.55228 13 5 13.4477 5 14V18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18V14zM9 12C9 11.4477 9.4477 11 10 11C10.5523 11 11 11.4477 11 12V18C11 18.5523 10.5523 19 10 19C9.4477 19 9 18.5523 9 18V12zM15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16V18C17 18.5523 16.5523 19 16 19C15.4477 19 15 18.5523 15 18V16z" fill="#01bacb"/>
                      </svg>
                      </div>

                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          <components.Highlight hit={item} attribute="value" />
                        </div>
                      </div>
                    </div>
                  </div>
                  </a>
              );
            },
          },
        },
      ];
    },
  };
}


type AuthorRecord = {
  value: string;
};

type CreateAuthorsPluginProps = {
  typesenseClient: Client;
};

//ÍRÓK LISTÁJA

function createAuthorsPlugin({
  typesenseClient,
}: CreateAuthorsPluginProps): AutocompletePlugin<AuthorRecord, undefined> {
  return {
    async getSources({ query }) {
      const results = await typesenseClient.collections('books').documents().search({
        q: query,
        query_by: "authors",
        sort_by: '_text_match:desc',
        prioritize_exact_match: true,
        per_page: 5,
        //group_by: 'DID',
        facet_query: `authors:${query}`,
        facet_by: "authors",
        use_cache: true,
      })
      if(!query || query == ""){
        return [];
      }
      return [
        {
          sourceId: 'authorsPlugin',
          getItems() {
            return results.facet_counts[0].counts;
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Írók</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item, components }) {
              const link = item.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[á]/g, 'a')
                .replace(/[é]/g, 'e')
                .replace(/[í]/g, 'i')
                .replace(/[óöő]/g, 'o')
                .replace(/[úüű]/g, 'u')
                .replace(/[,"';/[{}=+`~*]/g, '');
              return (
                <a href={`https://hernadi-antikvarium.hu/iro/${link}`} style="color: inherit; text-decoration: none;">
                  <div className="aa-ItemWrapper">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                      <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="none" stroke="#01bacb" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                      <circle cx="8" cy="6" r="3.25"/>
                      <path d="m2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/>
                      </svg>
                      </div>

                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          <components.Highlight hit={item} attribute="value" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            },
          },
        },
      ];
    },
  };
}


//const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: "search",
  limit: 5,
});
let typesenseClient = new Typesense.Client({
  'nearestNode': {'host': 'search.hernadi-antikvarium.hu', 'port': 443, 'protocol': 'https'},
  'nodes': [
      {'host': 'search.hernadi-antikvarium.hu', 'port': 443, 'protocol': 'https'},
      {'host': 'search.hernadi-antikvarium.hu', 'port': 443, 'protocol': 'https'},
      {'host': 'search.hernadi-antikvarium.hu', 'port': 443, 'protocol': 'https'},
  ],
  'apiKey': 'nLF68D1HqHAKBpi3E8RKGPVPBoGIxiaf',
  'connectionTimeoutSeconds': 500
})
/*const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: "books_default_query_suggestions",
  getSearchParams({ state }) {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      hitsPerPage: state.query ? 5 : 10,
    });
  },
  categoryAttribute: [
    "instant_search",
    "facets",
    "exact_matches",
    "categories",
  ],
  categoriesPerItem: 2,
});*/
const categoriesPlugin = createCategoriesPlugin({ typesenseClient });
const authorsPlugin = createAuthorsPlugin({ typesenseClient });



autocomplete<ProductHit>({
  container: "#autocomplete",
  placeholder: "Keresés",
  //debug: true,
  openOnFocus: true,
  plugins: [
    recentSearchesPlugin,
    categoriesPlugin,
    authorsPlugin,
  ],
  onSubmit({ state,event }) {
    //NOT Working!
    event.preventDefault(); 
    
    var urlPath= window.location.pathname;
    window.location.href = `/kereses?q=${state.query}`
    
  },
  //TERMÉKEK LISTÁJA
  async getSources({query}) {
    const results = !query || query == "" ? await typesenseClient.collections('books').documents().search({
      q: query,
      query_by: "title",
      sort_by: 'created_date:desc',
      per_page: 5,
      use_cache: true,
      //group_by: 'DID',
      //limit_hits: 5,
    }) : await typesenseClient.collections('books').documents().search({
      q: query,
      query_by: "title, authors",
      sort_by: '_text_match:desc,rating:desc',
      prioritize_exact_match: true,
      per_page: 5,
      use_cache: true,
      //group_by: 'DID',
      //limit_hits: 5,
    })
    return [
        {
          sourceId: 'predictions',
          getItems() {
            return results.hits;
          },
          getItemInputValue({item}) {
            return item;
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Termékek</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item, components }) {
              //console.log(JSON.stringify(item.hits[0].document));
              return (
                <ProductItem
                  hit={item.document}
                  components={components}
                  //insights={state.context.algoliaInsightsPlugin.insights}
                />
              );
            },
            noResults() {
              return "Nem található termék a keresési feltételek alapján.";
            },
          },
      },
    ];
  },
  render({ elements, render, html }, root) {
    const { recentSearchesPlugin, categoriesPlugin, authorsPlugin, predictions } = elements;
    render(
      recentSearchesPlugin || categoriesPlugin || authorsPlugin ?  
      html`
        <div class="aa-PanelLayout aa-Panel--scrollable">
          <div class="aa-PanelElement--Left">${recentSearchesPlugin} ${authorsPlugin} ${categoriesPlugin}</div>
          <div class="aa-PanelElement-Spacer"></div>
          <div class="aa-PanelElement--Right">${predictions}</div>
        </div>
      ` :
      html`
        <div class="aa-PanelLayout aa-Panel--scrollable">
          <div class="aa-PanelElement--Right">${predictions}</div>
        </div>
      `
      ,
      root
    )
  },
});

type ProductItemProps = {
  hit: ProductHit;
  components: AutocompleteComponents;
};

//PRODUCT ITEM OBJECT

function ProductItem({ hit, components }: ProductItemProps) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={`https://hernadi-antikvarium.hu/products/${hit.img}.jpg`} alt={hit.title} width="40" height="40" />
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Snippet hit={hit} attribute="title" />
          </div>
          <div className="aa-ItemContentDescription">
            Kiadó: <strong>{hit.publisher}</strong> <br />
            Író: <strong> {
              hit.authors.length === 1
              ? hit.authors[0]
              : hit.authors.length > 1
              ? hit.authors.slice(0, hit.authors.length - 1).join(', ') + ' and ' + hit.authors[hit.authors.length - 1]
              : ''
            }</strong> <br />
            Kategória: <strong>{
            hit.categories.length === 1
            ? hit.categories[0]
            : hit.categories.length > 1
            ? hit.categories.slice(0, hit.categories.length - 1).join(', ') + ' and ' + hit.categories[hit.categories.length - 1]
            : ''
            }</strong>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "grid",
                gridAutoFlow: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div>
                <span
                  style={{
                    color: "#000",
                    fontSize: "0.9em",
                    fontWeight: "bold",
                  }}
                >
                  {hit.sale_price.toLocaleString()} Ft
                </span>{" "}
                {hit.sale && (
                  <span
                    style={{
                      color: "rgb(var(--aa-muted-color-rgb))",
                      fontSize: "0.9em",
                      textDecoration: "line-through",
                    }}
                  >
                    {hit.price.toLocaleString()} Ft
                  </span>
                )}
              </div>
              {hit.sale && (
                <span
                  style={{
                    textTransform: "uppercase",
                    fontSize: "0.64em",
                    background: "#539753",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 9999,
                    padding: "2px 6px",
                    display: "inline-block",
                    lineHeight: "1.25em",
                  }}
                >
                  Akció
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
          type="button"
          title="Select"
          disabled={true}
          style={{ pointerEvents: "none" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
        {/*<button
          className="aa-ItemActionButton"
          type="button"
          title="Kosárba"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            insights.convertedObjectIDsAfterSearch({
              eventName: "Kosárhoz adva",
              index: hit.__autocomplete_indexName,
              objectIDs: [hit.objectID],
              queryID: hit.__autocomplete_queryID,
            });
          }}
        >
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,9H19.535l-3.7-5.555a1,1,0,0,0-1.664,1.11L17.132,9H6.868L9.832,4.555a1,1,0,0,0-1.664-1.11L4.465,9H3a1,1,0,0,0,0,2H4v8a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V11h1a1,1,0,0,0,0-2ZM9,17.5a1,1,0,0,1-2,0v-4a1,1,0,0,1,2,0Zm4,0a1,1,0,0,1-2,0v-4a1,1,0,0,1,2,0Zm4,0a1,1,0,0,1-2,0v-4a1,1,0,0,1,2,0Z"/></svg>
        </button>*/}
      </div>
    </a>
  );
}
