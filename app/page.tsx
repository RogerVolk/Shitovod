'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const denominations = [10, 50, 100, 200, 500, 1000, 2000];
const noteImages: Record<number, string> = {
  10: "/10.png",
  50: "/50.png",
  100: "/100.png",
  200: "/200.png",
  500: "/500.png",
  1000: "/1000.png",
  2000: "/2000.png",
};

function generateNotes(count = 10) {
  const notes = [];
  for (let i = 0; i < count; i++) {
    const value = denominations[Math.floor(Math.random() * denominations.length)];
    notes.push(value);
  }
  return notes;
}

export default function MoneyCountingGame() {
  const [step, setStep] = useState("menu");
  const [notes, setNotes] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState(0);
  const [timer, setTimer] = useState(0);
  const [balance, setBalance] = useState(4500);
  const [inputSum, setInputSum] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [history, setHistory] = useState<{ correct: boolean; amount: number; time: number }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "game") {
      interval = setInterval(() => setTimer((t) => t + 0.1), 100);
    }
    return () => clearInterval(interval);
  }, [step]);

  const startGame = () => {
    const newNotes = generateNotes();
    setNotes(newNotes);
    setCurrentNote(0);
    setTimer(0);
    setStep("game");
    setResult(null);
    setInputSum("");
  };

  const nextNote = () => {
    if (currentNote < notes.length - 1) {
      setCurrentNote(currentNote + 1);
    } else {
      setStep("input");
    }
  };

  const checkResult = () => {
    const correctSum = notes.reduce((a, b) => a + b, 0);
    const isCorrect = parseInt(inputSum) === correctSum;
    setResult(isCorrect);
    if (isCorrect) setBalance(balance + correctSum);
    setHistory([...history, { correct: isCorrect, amount: correctSum, time: +timer.toFixed(1) }]);
    setStep("result");
  };

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-[url('/paper-texture.png')] bg-cover">
      {step === "menu" && (
        <div className="space-y-6 text-center">
          <img src="/hand-money.png" alt="Рука с деньгами" className="mx-auto w-48 mb-4" />
          <Button onClick={startGame} className="w-full text-lg bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-md border border-gray-600 hover:brightness-110">
            ИГРАТЬ
          </Button>
          <Button onClick={() => setStep("progress")} variant="outline" className="w-full border-gray-400 text-gray-800">
            МОЙ ПРОГРЕСС
          </Button>
          <Button variant="outline" className="w-full border-gray-400 text-gray-800">
            НАСТРОЙКИ
          </Button>
        </div>
      )}

      {step === "game" && (
        <div className="space-y-4 text-center relative min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {notes.slice(currentNote, currentNote + 3).reverse().map((value, index) => (
              <motion.img
                key={`${currentNote}-${index}`}
                src={noteImages[value]}
                alt={`${value}₽`}
                initial={{ opacity: 0, y: 30 * index }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mx-auto w-64 absolute left-1/2 -translate-x-1/2 z-${10 - index}`}
                style={{ top: `${20 * index}px`, scale: 1 - index * 0.05 }}
              />
            ))}
          </AnimatePresence>
          <div className="pt-[200px]">
            <div>Купюра: {currentNote + 1} из {notes.length}</div>
            <div>Время: {timer.toFixed(1)} с</div>
            <div>На счету: {balance}₽</div>
            <Button onClick={nextNote}>Свайпнуть</Button>
          </div>
        </div>
      )}

      {step === "input" && (
        <div className="space-y-4 text-center">
          <Input
            type="number"
            placeholder="Введи итоговую сумму"
            value={inputSum}
            onChange={(e) => setInputSum(e.target.value)}
          />
          <Button onClick={checkResult}>ПРОВЕРИТЬ</Button>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-4 text-center">
          {result ? (
            <>
              <div className="text-xl font-bold">Ты правильно посчитал: {notes.reduce((a, b) => a + b, 0)}₽</div>
              <div>Время: {timer.toFixed(1)} с</div>
              <div className="text-green-600 font-semibold">+{notes.reduce((a, b) => a + b, 0)}₽ на счет</div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-red-600">Ошибка</div>
              <div>Правильно: {notes.reduce((a, b) => a + b, 0)}₽, ты ввел: {inputSum}₽</div>
            </>
          )}
          <Button onClick={startGame}>ИГРАТЬ СНОВА</Button>
          <Button variant="outline" onClick={() => setStep("menu")}>В ГЛАВНОЕ МЕНЮ</Button>
        </div>
      )}

      {step === "progress" && (
        <div className="space-y-4 text-center">
          <div className="text-xl font-bold">История игр</div>
          {history.length === 0 ? (
            <div>Пока нет результатов</div>
          ) : (
            <ul className="space-y-2">
              {history.map((h, i) => (
                <li key={i} className="border p-2 rounded shadow">
                  <div>{h.correct ? "✅" : "❌"} {h.amount}₽ — {h.time} с</div>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={() => setStep("menu")} variant="outline">НАЗАД</Button>
        </div>
      )}
    </div>
  );
}
