export default (htmlString) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, 'text/html');
  const titleEl = dom.querySelector('title');
  const title = titleEl.innerText;
  const descriptionEl = dom.querySelector('description');
  const description = descriptionEl.innerText;
  const postItems = dom.querySelectorAll('item');
  const posts = [...postItems].map((post) => {
    const postTitleEl = post.querySelector('title');
    const postTitle = postTitleEl.textContent
      .replace('<![CDATA[', '')
      .replace(']]>', '');
    const postDescriptionEl = post.querySelector('description');
    const postDescription = postDescriptionEl.textContent.trim();
    const postLinkEl = post.querySelector('a');
    const postLinkElAlternative = post.querySelector('link').nextSibling;
    const postLink = postLinkEl
      ? postLinkEl.href
      : postLinkElAlternative.textContent.trim();
    const postDateEl = post.querySelector('pubdate');
    const postDate = postDateEl.innerText;

    return {
      title: postTitle,
      description: postDescription,
      link: postLink,
      date: postDate,
    };
  });
  return { title, description, posts };
};
