[media pointer="file-service://file-Ge8YBKKUeAwNcesXMtAPv8"]
以下のコードに戻しました。もう一度考えてください。開発者ツールのスクショです

'use client'

import React, { useEffect, useState } from 'react';

type Row = {
  name: string;
  value: number;
};

export default function Page() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv');
        let text = await res.text();

        // BOM除去
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.slice(1);
        }

        console.log('取得したCSV:', text);

        const rows = text.split('\n').slice(1); // ヘッダー除去
        const parsedData = rows.map((row, i) => {
          const cols = row.trim().split(',');
          console.log(`row[${i}]`, cols); // ← デバッグ用
          return {
            name: cols[0],
            value: parseInt(cols[1]?.replace(/,/g, '') || '0')
          };
        });

        setData(parsedData.filter(row => row.name && !isNaN(row.value)));
      } catch (e) {
        console.error('読み込みエラー:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem', background: '#000', color: 'white' }}>
      <h1>R7 ふるさと納税 使い道</h1>
      {loading ? (
        <p>データを読み込み中...</p>
      ) : (
        <ul>
          {data.map((row, index) => (
            <li key={index}>
              {row.name}：{row.value.toLocaleString()} 千円
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
