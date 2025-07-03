'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

type Row = { name: string; value: number };

export default function Page() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      const res  = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv'
      );
      const text = await res.text();
      const csv  = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

      // CSV → オブジェクト配列
      const { data } = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
      });

      const NAME  = '事業名';
      const VALUE = 'ふるさとづくり基金 繰入金額（千円）';

      const parsed = data
        .map(r => {
          const name = r[NAME]?.trim();
          if (!name || name === '合計') return null;
          const val  = parseInt(r[VALUE]?.replace(/,/g, '') ?? '0', 10);
          return !isNaN(val) ? { name, value: val } : null;
        })
        .filter(Boolean) as Row[];

      setRows(parsed);
    };

    fetchCsv();
  }, []);

  const total = rows?.reduce((s, r) => s + r.value, 0) ?? 0;

  return (
    <main style={{ padding: 32, background: '#000', color: '#fff' }}>
      <h1>R7 ふるさと納税 使い道</h1>

      {rows === null ? (
        <p>データを読み込み中...</p>
      ) : (
        <>
          <ul>
            {rows.map(r => (
              <li key={r.name}>
                {r.name}：{r.value.toLocaleString()} 千円
              </li>
            ))}
          </ul>

          <p style={{ marginTop: 24, fontWeight: 'bold' }}>
            合計：{total.toLocaleString()} 千円
          </p>
        </>
      )}
    </main>
  );
}
