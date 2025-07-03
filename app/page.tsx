'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

type Row = {
  name: string;
  value: number;
};

export default function Page() {
  const [data, setData] = useState<Row[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv'
      );
      const text = await res.text();

      const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
      const rows = result.data as string[][];

      const parsed: Row[] = [];

      for (const row of rows.slice(1)) {
        const [name, rawValue] = row;
        if (name === '合計') continue;
        const value = parseInt(rawValue.replace(/,/g, ''));
        if (!isNaN(value)) {
          parsed.push({ name, value });
        }
      }

      setData(parsed);
    };

    fetchData();
  }, []);

  const total = data?.reduce((sum, row) => sum + row.value, 0) ?? 0;

  return (
    <main style={{ padding: '2rem', background: '#000', color: 'white' }}>
      <h1>R7 ふるさと納税 使い道</h1>
      {data === null ? (
        <p>データを読み込み中...</p>
      ) : (
        <>
          <ul>
            {data.map((row, index) => (
              <li key={index}>
                {row.name}：{row.value.toLocaleString()} 千円
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1rem' }}>
            <strong>合計：</strong>{total.toLocaleString()} 千円
          </p>
        </>
      )}
    </main>
  );
}
