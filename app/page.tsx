useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv');
      const text = await res.text();

      console.log('CSVの中身:', text); // ← まずはこれが出るか

      setData([{ name: 'テスト', value: 12345 }]); // 仮データを表示
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  fetchData();
}, []);
