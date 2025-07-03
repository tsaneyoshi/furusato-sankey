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

      // CSV → オブジェクト配列（ヘッダー行をキーにする）
      const { data } = Papa.parse<Record<string,string>>(text, {
        header: true,
        skipEmptyLines: true,
      });

      // 列名（全角スペースやカッコ込み）に合わせて抽出
      const NAME_KEY  = '事業名';
      const VALUE_KEY = 'ふるさとづくり基金 繰入金額（千円）';

      const parsed: Row[] = data
        .map(row => {
          const name = row[NAME_KEY]?.trim();
          const raw  = row[VALUE_KEY]?.replace(/,/g, '').trim();
          const value = parseInt(raw ?? '0', 10);
          return name && name !== '合計' && !isNaN(value)
            ? { name, value }
            : null;
        })
        .filter((r): r is Row => !!r);

      setRows(parsed);
    };

    fetchCsv();
  }, []);

  const total = rows?.reduce((sum, r) => sum + r.value, 0) ?? 0;

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
