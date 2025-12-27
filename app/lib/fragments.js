export const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    url
    items {
      id
      resourceId
      tags
      title
      url
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...MenuItem
    }
  }
`;

export const HEADER_QUERY = `#graphql
  query Header($headerMenuHandle: String!) {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

export const FOOTER_QUERY = `#graphql
  query Footer($footerMenuHandle: String!) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;