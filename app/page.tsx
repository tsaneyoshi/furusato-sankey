'use client'

import React, { useEffect, useState } from 'react';

type Row = {
  name: string;
  value: number;
};

export default function Page() {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv');
      const text = await res.text();

      const rows = text.trim().split('\n');

      const parsedData = rows.slice(1).map(row => {
        const cols = row.split('\t'); // ← ここが変更ポイント！

        if (!cols[0] || !cols[1]) return null;

        return {
          name: cols[0].trim(),
          value: parseInt(cols[1].replace(/,/g, '').trim(), 10)
        };
      }).filter((row): row is Row => !!row && !isNaN(row.value));

      setData(parsedData);
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem', background: '#000', color: 'white' }}>
      <h1>R7 ふるさと納税 使い道</h1>
      {data.length === 0 ? (
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
