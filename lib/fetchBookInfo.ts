export const fetchBookInfo = async (isbn: string) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
  
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        return {
          title: book.title || '',
          author: (book.authors && book.authors.length > 0) ? book.authors[0] : '',
          image: (book.imageLinks && book.imageLinks.thumbnail) ? book.imageLinks.thumbnail : '',
        };
      } else {
        throw new Error('書籍情報が見つかりませんでした');
      }
    } catch (error) {
      throw new Error('書籍情報の取得に失敗しました');
    }
  };
  