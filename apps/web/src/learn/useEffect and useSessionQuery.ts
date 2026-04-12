  // cần tìm hiểu thật rõ
  const handleSubmitSearch = (search: string) => setQueryParams('q', search);
  const handleSearch = (key: string) => {
    setSearchKey(key);
  };

    // nghiên cứu không xài useEffect mà sang xài useSessionQuery
  // useEffect(() => {
  //   const ref = setTimeout(() => {
  //     setQueryParams((params) => ({ ...params, q: searchKey }));
  //   }, 500);

  //   return () => {
  //     clearTimeout(ref);
  //   };
  // }, [searchKey]);
