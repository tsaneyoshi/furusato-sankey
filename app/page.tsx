useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv');
    const text = await res.text();

    console.log('取得したCSVの中身:', text);

    const rows = text.trim().split('\n');
    console.log('行数:', rows.length);

    const parsedData = rows.slice(1).map((row, i) => {
      const cols = row.split('\t');
      console.log(`row ${i + 1}:`, cols);

      if (!cols[0] || !cols[1]) return null;

      return {
        name: cols[0].trim(),
        value: parseInt(cols[1].replace(/,/g, '').trim(), 10)
      };
    }).filter((row): row is Row => !!row && !isNaN(row.value));

    console.log('パース後のデータ:', parsedData);
    setData(parsedData);
  };

  fetchData();
}, []);
