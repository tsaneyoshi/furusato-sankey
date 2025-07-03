'use client'

import React, { useEffect, useState } from 'react';

type Row = {
  name: string;
  value: number;
};

export default function Page() {
  const [data, setData] = useState<Row[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv');
      const text = await res.text();

      const lines = text.split('\n').slice(1); // ヘッダーを除く

      const parsed = lines.map(line => {
        const match = line.match(/^"?(.*?)"?,"?([\d,]+)"?$/); // 事業名 + 数値
        if (match) {
          const name = match[1];
          const value = parseInt(match[2].replace(/,/g, ''));
          return { name, value };
        }
        return null;
      }).filter(Boolean) as Row[];

      setData(parsed);
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem', background: '#000', color: 'white' }}>
      <h1>R7 ふるさと納税 使い道</h1>
      {data === null ? (
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
