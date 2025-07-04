'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import dynamic from 'next/dynamic';

const SankeyChart = dynamic(() => import('./SankeyChart'), {
  ssr: false,
  loading: () => <p style={{ textAlign: 'center', padding: '40px' }}>グラフを読み込んでいます...</p>
});

const formatToJapaneseCurrency = (valueInKiloYen: number): string => {
  const yen = valueInKiloYen * 1000;
  const oku = Math.floor(yen / 100000000);
  const man = Math.floor((yen % 100000000) / 10000);
  let result = '';
  if (oku > 0) result += `${oku}億`;
  if (man > 0) {
    if (oku > 0 && man.toString().length < 4) result += `${man.toString().padStart(4, '0')}万円`;
    else result += `${man.toLocaleString()}万円`;
  }
  if (result === '') return `${yen.toLocaleString()}円`;
  return result;
};

// ★ 変更点: Row型に totalCost と page を追加
type Row = {
  name: string;
  value: number;
  description: string;
  totalCost: number;
  page: string;
};

export default function Page() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVULoGN1BSXkQ2CjpWfFRAyxYpAmQ70NdUCFl3N9M6AmNOiT5zc6bRH6rNvTAXR7tacXrwL361OmZ1/pub?output=csv');
      const txt = await res.text();
      const csv = txt.charCodeAt(0) === 0xfeff ? txt.slice(1) : txt;
      const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

      // ★ 変更点: CSVのヘッダー名を追加
      const NAME = '事業名';
      const VALUE = 'ふるさとづくり基金 繰入金額（千円）';
      const DESCRIPTION = '内容';
      const TOTAL_COST = '事業費（千円）';
      const PAGE = 'ページ';

      const list = data
        .map(r => {
          const name = r[NAME]?.trim();
          if (!name || name === '合計') return null;

          // ★ 変更点: 各列のデータを取得
          const value = parseInt(r[VALUE]?.replace(/,/g, '') ?? '0', 10);
          const description = r[DESCRIPTION]?.trim() ?? '';
          const totalCost = parseInt(r[TOTAL_COST]?.replace(/,/g, '') ?? '0', 10);
          const page = r[PAGE]?.trim() ?? '';

          return !isNaN(value) ? { name, value, description, totalCost, page } : null;
        })
        .filter(Boolean) as Row[];
      setRows(list);
    };
    load();
  }, []);

  const total = rows?.reduce((s, r) => s + r.value, 0) ?? 0;

  return (
    <div className="container">
      <header className="header">
        <h1></h1>
        <p></p>
      </header>

      <main className="card">
        <h2>令和７年度 ふるさと納税から各事業への配分</h2>
        {rows === null ? (
          <p>データを読み込んでいます...</p>
        ) : (
          <>
            <SankeyChart data={rows} />
            <p className="total-amount">
              合計：{formatToJapaneseCurrency(total)}
            </p>
          </>
        )}
      </main>

      <footer className="footer">
        <p>データソース: 守谷市 令和7年度予算資料より</p>
      </footer>
    </div>
  );
}