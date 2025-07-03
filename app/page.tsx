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
      const rows = text.split('\n').slice(1); // ヘッダーを除外

      const parsedData = rows.map(row => {
        const cols = row.split(',');
        return {
          name: cols[0],
          value: parseInt(cols[1]?.replace(/,/g, '') || '0')
        };
      });

      setData(parsedData.filter(row => row.name && !isNaN(row.value)));
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>R7 ふるさと納税 使い道</h1>
      <ul>
        {data.map((row, index) => (
          <li key={index}>
            {row.name}：{row.value.toLocaleString()} 千円
          </li>
        ))}
      </ul>
    </main>
  );
}
