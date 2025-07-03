'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse'; // papaparseをインポート

// Rowの型定義
type Row = {
  name: string;
  value: number;
};

export default function Page() {
  // dataの初期値をnullにして、ローディング状態を明確にする
  const [data, setData] = useState<Row[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv'
        );
        const text = await res.text();

        // Papa Parseを使用してCSVをパース
        // header: false とし、データは配列の配列として受け取る
        const result = Papa.parse<string[]>(text, {
          skipEmptyLines: true,
        });

        const rows = result.data;

        // ヘッダー行を除外して処理 (rows.slice(1))
        const parsedData: Row[] = rows
          .slice(1) // ヘッダー行（1行目）をスキップ
          .map(row => {
            const name = row[0];
            const rawValue = row[1];

            // カンマを除去して数値に変換
            const value = parseInt(String(rawValue).replace(/,/g, ''), 10);

            return { name, value };
          })
          // `合計`の行と、正しくパースできなかった行を除外
          .filter(row => row.name && row.name !== '合計' && !isNaN(row.value));

        setData(parsedData);

      } catch (e) {
        console.error('読み込みエラー:', e);
        // エラーが発生した場合も、ローディングが終了したことがわかるように空の配列をセット
        setData([]);
      }
    };

    fetchData();
  }, []); // Eslintの警告を避けるため、空の依存配列を渡す

  // 合計値の計算
  const total = data?.reduce((sum, row) => sum + row.value, 0) ?? 0;

  // ローディング中の表示
  if (data === null) {
    return (
      <main style={{ padding: '2rem', background: '#000', color: 'white' }}>
        <h1>R7 ふるさと納税 使い道</h1>
        <p>データを読み込み中...</p>
      </main>
    );
  }

  // データ表示
  return (
    <main style={{ padding: '2rem', background: '#000', color: 'white' }}>
      <h1>R7 ふるさと納税 使い道</h1>
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
    </main>
  );
}
