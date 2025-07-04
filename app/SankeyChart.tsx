'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo, useState, useEffect } from 'react';

// 金額フォーマット関数 (変更なし)
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

// Row型定義 (変更なし)
type Row = { name: string; value: number; description: string };
interface SankeyChartProps {
  data: Row[];
}

export default function SankeyChart({ data }: SankeyChartProps) {
  // 画面幅検知のロジック (変更なし)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const option = useMemo(() => {
    // カラーパレットやデータ定義 (変更なし)
    const stripeColor = '#635bff';
    const colorPalette = ['#635bff', '#7795f8', '#8ce2b3', '#32cde3', '#e8e8eb', '#6772e5', '#3ecf8e', '#4fd8e0'];
    const nodes = [{ name: '合計', itemStyle: { color: stripeColor } }, ...data.map(item => ({ name: item.name }))];
    const links = data.map(item => ({
      source: '合計',
      target: item.name,
      value: item.value,
      description: item.description,
    }));

    return {
      color: colorPalette,
      tooltip: {
        trigger: 'item',
        triggerOn: isMobile ? 'click' : 'mousemove',
        // ★ 変更点: ツールチップの見た目を調整
        formatter: (params: any) => {
          // グラフの線 (edge) にホバーした時のツールチップ
          if (params.dataType === 'edge') {
            const description = params.data.description;
            
            // 事業名と金額部分
            let tooltipText = `
              <div style="text-align: left; font-size: 14px;">
                ${params.data.target}<br />
                <strong style="font-size: 16px;">${formatToJapaneseCurrency(params.data.value)}</strong>
              </div>
            `;

            // 事業内容があれば、区切り線と見出しを付けて表示
            if (description) {
              tooltipText += `
                <hr style="margin: 10px 0; border-style: solid; border-color: #555; border-width: 1px 0 0 0;">
                <div style="max-width: 300px; white-space: normal; text-align: left;">
                  <strong style="color: #fff;">▼ 事業内容</strong><br>
                  <span style="font-size: 13px; color: #eee;">${description}</span>
                </div>
              `;
            }
            return tooltipText;
          }

          // 合計ノードのツールチップ (変更なし)
          const nodeValue = params.name === 'ふるさと納税 合計' ? links.reduce((sum, l) => sum + l.value, 0) : params.value;
          return `${params.name}<br /><strong>${formatToJapaneseCurrency(nodeValue)}</strong>`;
        },
        // position以下の設定は変更なし
        position: isMobile
          ? function (point: any, params: any, dom: any, rect: any, size: any) {
              const x = (size.viewSize[0] / 2) - (size.contentSize[0] / 2);
              const y = point[1] - (size.contentSize[1] / 2);
              return [x, y];
            }
          : undefined,
        borderWidth: 0,
        backgroundColor: 'rgba(32, 32, 32, 0.9)',
        textStyle: { color: '#fff' },
        padding: 12, // パディングを少し追加して見やすく
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          emphasis: { focus: 'adjacency' },
          nodeAlign: 'left',
          nodeGap: 18,
          draggable: false,
          data: nodes,
          links: links,
          label: {
            color: '#0a2540',
            fontFamily: 'sans-serif',
            fontSize: isMobile ? 10 : 12,
          },
          itemStyle: { borderWidth: 1, borderColor: '#e6ebf1' },
          lineStyle: { color: 'source', curveness: 0.5, opacity: 0.6 },
        },
      ],
    };
  }, [data, isMobile]);

  return <ReactECharts option={option} style={{ height: '800px', width: '100%' }} />;
}