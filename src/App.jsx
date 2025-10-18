import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function GSYHSimulator() {
  // Tüketim alt kalemleri
  const [dayanikliMal, setDayanikliMal] = useState(50);
  const [dayaniksizMal, setDayaniksizMal] = useState(50);
  const [hizmetler, setHizmetler] = useState(50);

  // Yatırım alt kalemleri
  const [konut, setKonut] = useState(50);
  const [isletme, setIsletme] = useState(50);
  const [stokDegisim, setStokDegisim] = useState(50);

  // Kamu alt kalemleri
  const [cariHarcama, setCariHarcama] = useState(50);
  const [kamuYatirim, setKamuYatirim] = useState(50);

  // Dış Ticaret alt kalemleri
  const [ihracat, setIhracat] = useState(50);
  const [ithalat, setIthalat] = useState(50);

  // GSYİH geçmişi
  const [gsyhHistory, setGsyhHistory] = useState([]);

  // Ana kalemleri hesapla
  const tuketim = (dayanikliMal + dayaniksizMal + hizmetler) * 2; // C
  const yatirim = (konut + isletme + stokDegisim) * 1.5; // I
  const kamu = (cariHarcama + kamuYatirim) * 2.5; // G
  const netIhracat = (ihracat - ithalat) * 1.5; // X - M

  // GSYİH = C + I + G + (X - M)
  const gsyh = tuketim + yatirim + kamu + netIhracat;

  // GSYİH değiştiğinde geçmişe ekle
  useEffect(() => {
    setGsyhHistory((prev) => {
      const newHistory = [
        ...prev,
        {
          zaman: prev.length + 1,
          gsyh: gsyh,
        },
      ];
      // Son 25 veriyi tut
      if (newHistory.length > 25) {
        return newHistory.slice(-25);
      }
      return newHistory;
    });
  }, [gsyh]);

  // Grafik verisi
  const chartData = [
    {
      name: "Tüketim (C)",
      deger: tuketim,
      fill: "#3b82f6",
    },
    {
      name: "Yatırım (I)",
      deger: yatirim,
      fill: "#10b981",
    },
    {
      name: "Kamu (G)",
      deger: kamu,
      fill: "#f59e0b",
    },
    {
      name: "Net İhracat",
      deger: Math.abs(netIhracat),
      fill: netIhracat >= 0 ? "#8b5cf6" : "#ef4444",
    },
  ];

  const SliderComponent = ({ label, value, setValue, color }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className={`text-sm font-bold px-2 py-1 rounded ${color}`}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${
            color.includes("blue")
              ? "#3b82f6"
              : color.includes("green")
              ? "#10b981"
              : color.includes("orange")
              ? "#f59e0b"
              : "#8b5cf6"
          } 0%, ${
            color.includes("blue")
              ? "#3b82f6"
              : color.includes("green")
              ? "#10b981"
              : color.includes("orange")
              ? "#f59e0b"
              : "#8b5cf6"
          } ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            GSYİH Simülatörü
          </h1>
          <p className="text-gray-600">
            Gayri Safi Yurtiçi Hasıla = C + I + G + (X - M)
          </p>
        </div>

        {/* GSYİH Göstergesi */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="text-center">
            <p className="text-xl mb-2 opacity-90">Toplam GSYİH</p>
            <div className="flex items-center justify-center gap-4">
              <h2 className="text-6xl font-bold">{gsyh.toFixed(0)}</h2>
              <div className="text-3xl">
                {gsyh >= 900 ? (
                  <TrendingUp size={48} />
                ) : (
                  <TrendingDown size={48} />
                )}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="opacity-80">Tüketim (C)</p>
                <p className="font-bold text-lg">{tuketim.toFixed(0)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="opacity-80">Yatırım (I)</p>
                <p className="font-bold text-lg">{yatirim.toFixed(0)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="opacity-80">Kamu (G)</p>
                <p className="font-bold text-lg">{kamu.toFixed(0)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="opacity-80">Net İhracat</p>
                <p className="font-bold text-lg">{netIhracat.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* GSYİH Çizgi Grafiği */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              GSYİH Değişim Grafiği
            </h3>
            <button
              onClick={() => setGsyhHistory([])}
              className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Grafiği Sıfırla
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={gsyhHistory}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="zaman"
                label={{ value: "Zaman", position: "bottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "GSYİH", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="gsyh"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            GSYİH Bileşenleri
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deger" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Kontrol Panelleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tüketim (C) */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <h3 className="text-xl font-bold text-gray-800">Tüketim (C)</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {tuketim.toFixed(0)}
            </div>
            <SliderComponent
              label="Dayanıklı Mal"
              value={dayanikliMal}
              setValue={setDayanikliMal}
              color="bg-blue-100 text-blue-700"
            />
            <SliderComponent
              label="Dayanıksız Mal"
              value={dayaniksizMal}
              setValue={setDayaniksizMal}
              color="bg-blue-100 text-blue-700"
            />
            <SliderComponent
              label="Hizmetler"
              value={hizmetler}
              setValue={setHizmetler}
              color="bg-blue-100 text-blue-700"
            />
          </div>

          {/* Yatırım (I) */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <h3 className="text-xl font-bold text-gray-800">Yatırım (I)</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-4">
              {yatirim.toFixed(0)}
            </div>
            <SliderComponent
              label="Konut"
              value={konut}
              setValue={setKonut}
              color="bg-green-100 text-green-700"
            />
            <SliderComponent
              label="İşletme (Makine/Bina)"
              value={isletme}
              setValue={setIsletme}
              color="bg-green-100 text-green-700"
            />
            <SliderComponent
              label="Stok Değişim"
              value={stokDegisim}
              setValue={setStokDegisim}
              color="bg-green-100 text-green-700"
            />
          </div>

          {/* Kamu (G) */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <h3 className="text-xl font-bold text-gray-800">Kamu (G)</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-4">
              {kamu.toFixed(0)}
            </div>
            <SliderComponent
              label="Cari Harcama"
              value={cariHarcama}
              setValue={setCariHarcama}
              color="bg-orange-100 text-orange-700"
            />
            <SliderComponent
              label="Kamu Yatırımı"
              value={kamuYatirim}
              setValue={setKamuYatirim}
              color="bg-orange-100 text-orange-700"
            />
          </div>

          {/* Dış Ticaret */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-4 h-4 rounded ${
                  netIhracat >= 0 ? "bg-purple-500" : "bg-red-500"
                }`}
              ></div>
              <h3 className="text-xl font-bold text-gray-800">Dış Ticaret</h3>
            </div>
            <div
              className={`text-3xl font-bold mb-4 ${
                netIhracat >= 0 ? "text-purple-600" : "text-red-600"
              }`}
            >
              {netIhracat.toFixed(0)}
            </div>
            <SliderComponent
              label="İhracat (X)"
              value={ihracat}
              setValue={setIhracat}
              color="bg-purple-100 text-purple-700"
            />
            <SliderComponent
              label="İthalat (M)"
              value={ithalat}
              setValue={setIthalat}
              color="bg-purple-100 text-purple-700"
            />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                {netIhracat >= 0
                  ? "✅ Dış Ticaret Fazlası"
                  : "⚠️ Dış Ticaret Açığı"}
              </p>
            </div>
          </div>
        </div>

        {/* Bilgi Notu */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            📊 GSYİH Hakkında
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-2">GSYİH Formülü:</p>
              <p className="bg-gray-50 p-3 rounded">
                GSYİH = C + I + G + (X - M)
              </p>
              <ul className="mt-2 space-y-1 ml-4">
                <li>
                  • <strong>C:</strong> Tüketim harcamaları
                </li>
                <li>
                  • <strong>I:</strong> Yatırım harcamaları
                </li>
                <li>
                  • <strong>G:</strong> Kamu harcamaları
                </li>
                <li>
                  • <strong>(X-M):</strong> Net ihracat
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Nasıl Çalışır:</p>
              <ul className="space-y-1">
                <li>
                  🔵 <strong>Tüketim:</strong> Hanehalkı harcamaları
                </li>
                <li>
                  🟢 <strong>Yatırım:</strong> Üretim kapasitesi artışı
                </li>
                <li>
                  🟠 <strong>Kamu:</strong> Devlet harcamaları
                </li>
                <li>
                  🟣 <strong>Net İhracat:</strong> İhracat - İthalat
                </li>
              </ul>
              <p className="mt-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                💡 İpucu: Sürgüleri hareket ettirerek her bileşenin GSYİH
                üzerindeki etkisini görün!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
