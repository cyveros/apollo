import { ApolloPage } from './app.po';

describe('apollo App', function() {
  let page: ApolloPage;

  beforeEach(() => {
    page = new ApolloPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
