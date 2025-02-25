"use client";

import { ChevronDown, ChevronRight, ChevronUp, Minus, Square, X } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"

export default function Home() {
  const [onlineExpanded, setOnlineExpanded] = useState(true)
  const [offlineExpanded, setOfflineExpanded] = useState(true)
  const [isMsnOpen, setIsMsnOpen] = useState(false)
  const [isMsnMinimized, setIsMsnMinimized] = useState(false)
  const [isMsnMaximized, setIsMsnMaximized] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isCalculatorMinimized, setIsCalculatorMinimized] = useState(false)
  const [isCalculatorMaximized, setIsCalculatorMaximized] = useState(false)
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isNotepadMinimized, setIsNotepadMinimized] = useState(false)
  const [isNotepadMaximized, setIsNotepadMaximized] = useState(false)
  const [msnPosition, setMsnPosition] = useState({ x: 16, y: 16 })
  const [calculatorPosition, setCalculatorPosition] = useState({ x: 100, y: 100 })
  const [notepadPosition, setNotepadPosition] = useState({ x: 200, y: 50 })
  const [isDraggingMsn, setIsDraggingMsn] = useState(false)
  const [isDraggingCalculator, setIsDraggingCalculator] = useState(false)
  const [isDraggingNotepad, setIsDraggingNotepad] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [calculatorDisplay, setCalculatorDisplay] = useState("0")
  const [calculatorMemory, setCalculatorMemory] = useState(0)
  const [calculatorOperation, setCalculatorOperation] = useState<string | null>(null)
  const [calculatorPrevValue, setCalculatorPrevValue] = useState<number | null>(null)
  const [calculatorWaitingForOperand, setCalculatorWaitingForOperand] = useState(false)
  const [notepadContent, setNotepadContent] = useState("")
  const msnWindowRef = useRef<HTMLDivElement>(null)
  const calculatorWindowRef = useRef<HTMLDivElement>(null)
  const notepadWindowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent, app: string) => {
    const targetRef = app === 'calculator' ? calculatorWindowRef : app === 'notepad' ? notepadWindowRef : msnWindowRef
    if (targetRef.current && e.target === targetRef.current.firstChild) {
      if (app === 'calculator') {
        setIsDraggingCalculator(true)
        setDragOffset({
          x: e.clientX - calculatorPosition.x,
          y: e.clientY - calculatorPosition.y
        })
      } else if (app === 'notepad') {
        setIsDraggingNotepad(true)
        setDragOffset({
          x: e.clientX - notepadPosition.x,
          y: e.clientY - notepadPosition.y
        })
      } else {
        setIsDraggingMsn(true)
        setDragOffset({
          x: e.clientX - msnPosition.x,
          y: e.clientY - msnPosition.y
        })
      }
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingMsn) {
      setMsnPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    } else if (isDraggingCalculator) {
      setCalculatorPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    } else if (isDraggingNotepad) {
      setNotepadPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
  }, [isDraggingMsn, isDraggingCalculator, isDraggingNotepad, dragOffset])

  const handleMouseUp = () => {
    setIsDraggingMsn(false)
    setIsDraggingCalculator(false)
    setIsDraggingNotepad(false)
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const handleMsnIconClick = () => {
    setIsMsnOpen(true)
    setIsMsnMinimized(false)
  }

  const handleCalculatorIconClick = () => {
    setIsCalculatorOpen(true)
    setIsCalculatorMinimized(false)
  }

  const handleNotepadIconClick = () => {
    setIsNotepadOpen(true)
    setIsNotepadMinimized(false)
  }

  const handleCalculatorButtonClick = (value: string) => {
    if (value === 'C') {
      setCalculatorDisplay("0")
      setCalculatorOperation(null)
      setCalculatorPrevValue(null)
      setCalculatorWaitingForOperand(false)
    } else if (value === 'CE') {
      setCalculatorDisplay("0")
      setCalculatorWaitingForOperand(false)
    } else if (value === '+/-') {
      setCalculatorDisplay(prev => (parseFloat(prev) * -1).toString())
    } else if (value === '.') {
      if (!calculatorDisplay.includes('.')) {
        setCalculatorDisplay(prev => prev + '.')
      }
      setCalculatorWaitingForOperand(false)
    } else if (['+', '-', '*', '/', '%'].includes(value)) {
      setCalculatorOperation(value)
      setCalculatorPrevValue(parseFloat(calculatorDisplay))
      setCalculatorWaitingForOperand(true)
    } else if (value === '=') {
      if (calculatorOperation && calculatorPrevValue !== null) {
        const currentValue = parseFloat(calculatorDisplay)
        let result: number
        switch (calculatorOperation) {
          case '+':
            result = calculatorPrevValue + currentValue
            break
          case '-':
            result = calculatorPrevValue - currentValue
            break
          case '*':
            result = calculatorPrevValue * currentValue
            break
          case '/':
            result = calculatorPrevValue / currentValue
            break
          case '%':
            result = calculatorPrevValue % currentValue
            break
          default:
            result = currentValue
        }
        setCalculatorDisplay(result.toString())
        setCalculatorOperation(null)
        setCalculatorPrevValue(null)
        setCalculatorWaitingForOperand(true)
      }
    } else if (value === 'sqrt') {
      setCalculatorDisplay(Math.sqrt(parseFloat(calculatorDisplay)).toString())
      setCalculatorWaitingForOperand(true)
    } else if (value === '1/x') {
      setCalculatorDisplay((1 / parseFloat(calculatorDisplay)).toString())
      setCalculatorWaitingForOperand(true)
    } else if (value === 'MC') {
      setCalculatorMemory(0)
    } else if (value === 'MR') {
      setCalculatorDisplay(calculatorMemory.toString())
      setCalculatorWaitingForOperand(true)
    } else if (value === 'MS') {
      setCalculatorMemory(parseFloat(calculatorDisplay))
    } else if (value === 'M+') {
      setCalculatorMemory(calculatorMemory + parseFloat(calculatorDisplay))
    } else {
      if (calculatorWaitingForOperand) {
        setCalculatorDisplay(value)
        setCalculatorWaitingForOperand(false)
      } else {
        setCalculatorDisplay(prev => prev === "0" ? value : prev + value)
      }
    }
  }

  return (
    
    <div className="w-full h-screen bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: "url('https://i.imgur.com/zXSWNp3.jpeg')" }}>
      {/* Desktop Icons */}
      <div className="absolute top-1 left-5 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] grid-rows-[repeat(auto-fill,minmax(80px,1fr))] max-h-[calc(100vh-2rem)] max-w-[240px] overflow-y-auto gap-1">
        <DesktopIcon label="Recycle Bin" icon="🗑️" onClick={() => {}} />
        <DesktopIcon label="Messenger" icon="💬" onClick={handleMsnIconClick} />
        <DesktopIcon label="Calculator" icon="🧮" onClick={handleCalculatorIconClick} />
        <DesktopIcon label="Notepad" icon="📝" onClick={handleNotepadIconClick} />
        <DesktopIcon label="Twitter" icon="𝕏" onClick={() => window.open('https://twitter.com/aaronsiim', '_blank')} />
        <DesktopIcon label="GitHub" icon="💻" onClick={() => window.open('https://github.com/aaronsimca/', '_blank')} />
        <DesktopIcon label="Book" icon="📕" onClick={() => window.open('https://a.co/d/ac8QMF4', '_blank')} />
        <DesktopIcon label="LinkedIn" icon="📋" onClick={() => window.open('https://www.linkedin.com/in/aaronsimca/', '_blank')} />
      </div>

      {isMsnOpen && !isMsnMinimized && (
        <div 
          ref={msnWindowRef}
          className={`bg-blue-600 border border-blue-700 shadow-md font-sans text-xs absolute rounded-t-md overflow-hidden ${isMsnMaximized ? 'w-full h-full' : 'w-64'}`}
          style={isMsnMaximized ? {} : { left: `${msnPosition.x}px`, top: `${msnPosition.y}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'msn')}
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-1 flex justify-between items-center cursor-move">
            <div className="flex items-center">
              <span className="mr-1 text-lg" aria-hidden="true">💬</span>
              <span className="font-bold">MSN Messenger</span>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setIsMsnMinimized(true)} className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center rounded-sm" aria-label="Minimize">
                <Minus className="w-3 h-3" />
              </button>
              <button onClick={() => setIsMsnMaximized(!isMsnMaximized)} className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center rounded-sm" aria-label="Maximize">
                <Square className="w-3 h-3" />
              </button>
              <button onClick={() => setIsMsnOpen(false)} className="w-4 h-4 bg-gradient-to-b from-red-400 to-red-500 text-white flex items-center justify-center rounded-sm" aria-label="Close">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="bg-gray-200 p-1">
            <div className="flex text-xs mb-1">
              <span className="mr-2 text-blue-800">File</span>
              <span className="mr-2 text-blue-800">Contacts</span>
              <span className="mr-2 text-blue-800">Actions</span>
              <span className="mr-2 text-blue-800">Tools</span>
              <span className="text-blue-800">Help</span>
            </div>
            <div className="bg-white border border-gray-400 p-2 mb-2">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-green-50 p-1 rounded">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">🟢</div>
                <span>My Status:</span>
                <span className="text-green-600 font-semibold">🧑 (Online)</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-yellow-50 p-1 rounded mt-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">✉️</div>
                <span className="text-gray-600">No new e-mail messages</span>
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <button 
                onClick={() => setOnlineExpanded(!onlineExpanded)}
                className="flex items-center w-full text-left bg-gradient-to-r from-blue-200 to-blue-100 p-1 rounded"
                aria-expanded={onlineExpanded}
                aria-controls="online-contacts"
              >
                {onlineExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="font-bold">Online (5)</span>
              </button>
              {onlineExpanded && (
                <div id="online-contacts" className="pl-4 space-y-1 mt-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">🔴</div>
                    <span>👤 Jered Swift (Busy)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">🟢</div>
                    <span>👤 aaronsimhq@gmail.com </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">🟢</div>
                    <span>👤 Kate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">🟢</div>
                    <span>👤 Roy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white" aria-hidden="true">🟡</div>
                    <span>👤 Yio (Away)</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              <button 
                onClick={() => setOfflineExpanded(!offlineExpanded)}
                className="flex items-center w-full text-left bg-gradient-to-r from-gray-200 to-gray-100 p-1 rounded"
                aria-expanded={offlineExpanded}
                aria-controls="offline-contacts"
              >
                {offlineExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="font-bold">Not Online (11)</span>
              </button>
              {offlineExpanded && (
                <div id="offline-contacts" className="pl-4 space-y-1 mt-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 sabrinacarp@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 jackie_ballow </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 jackie chen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 Jennifer A</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 Joshep</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 june</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white" aria-hidden="true">⚪</div>
                    <span>👤 yc</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-300 p-2 bg-gradient-to-b from-white to-gray-50">
            <div className="flex justify-between items-center">
              <span>I want to...</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-1 mt-1">
              <div className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded">
                <span aria-hidden="true">➕</span>
                <span className="text-blue-600">Add a Contact</span>
              </div>
              <div className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded">
                <span aria-hidden="true">💬</span>
                <span className="text-blue-600">Send an Instant Message</span>
              </div>
              <div className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded">
                <span aria-hidden="true">📁</span>
                <span className="text-blue-600">Send a File or Photo</span>
              </div>
              <div className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded">
                <span aria-hidden="true">🎮</span>
                <span className="text-blue-600">Play a Game</span>
              </div>
              <div className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded">
                <span aria-hidden="true">🔍</span>
                <span className="text-blue-600">Search for a Contact</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-2 flex justify-between items-center">
            <span className="text-blue-600 hover:underline cursor-pointer">More</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      {isCalculatorOpen && !isCalculatorMinimized && (
        <div 
          ref={calculatorWindowRef}
          className={`bg-blue-600 border border-blue-700 shadow-md font-sans text-xs absolute rounded-t-md overflow-hidden ${isCalculatorMaximized ? 'w-full h-full' : 'w-64'}`}
          style={isCalculatorMaximized ? {} : { left: `${calculatorPosition.x}px`, top: `${calculatorPosition.y}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'calculator')}
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-1 flex justify-between items-center cursor-move">
            <div className="flex items-center">
              <span className="mr-1" aria-hidden="true">🧮</span>
              <span className="font-bold">Calculator</span>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setIsCalculatorMinimized(true)} className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center rounded-sm" aria-label="Minimize">
                <Minus className="w-3 h-3" />
              </button>
              <button onClick={() => setIsCalculatorMaximized(!isCalculatorMaximized)} className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center rounded-sm" aria-label="Maximize">
                <Square className="w-3 h-3" />
              </button>
              <button onClick={() => setIsCalculatorOpen(false)} className="w-4 h-4 bg-gradient-to-b from-red-400 to-red-500 text-white flex items-center justify-center rounded-sm" aria-label="Close">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="bg-gray-200 p-1">
            <div className="flex text-xs mb-1">
              <span className="mr-2 text-blue-800">Edit</span>
              <span className="mr-2 text-blue-800">View</span>
              <span className="text-blue-800">Help</span>
            </div>
            <div className="bg-white border border-gray-400 p-1 mb-2">
              <div className="text-right text-2xl">{calculatorDisplay}</div>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[
                'CE', 'C', 'MC', 'MR', 'MS',
                '7', '8', '9', '/', 'sqrt',
                '4', '5', '6', '*', '%',
                '1', '2', '3', '-', '1/x',
                '0', '+/-', '.', '+', '='
              ].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorButtonClick(btn)}
                  className={`
                    bg-gradient-to-b from-gray-100 to-gray-200
                    ${['CE', 'C'].includes(btn) ? 'text-red-600' : ''}
                    ${['MC', 'MR', 'MS', 'M+'].includes(btn) ? 'text-blue-600' : ''}
                    ${['+', '-', '*', '/', '=', 'sqrt', '%', '1/x'].includes(btn) ? 'text-blue-600' : ''}
                    ${!isNaN(parseInt(btn)) || btn === '.' || btn === '+/-' ? 'text-black' : ''}
                    py-2 px-3 rounded-lg border border-gray-300 text-xs font-bold shadow-sm 
                    hover:from-gray-200 hover:to-gray-300 active:from-gray-300 active:to-gray-400
                    transition-all duration-100 ease-in-out
                  `}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isNotepadOpen && !isNotepadMinimized && (
        <div 
          ref={notepadWindowRef}
          className={`bg-blue-600 border border-blue-700 shadow-md font-sans text-xs absolute rounded-t-md overflow-hidden ${isNotepadMaximized ? 'w-full h-full' : 'w-80 h-96'}`}
          style={isNotepadMaximized ? {} : { left: `${notepadPosition.x}px`, top: `${notepadPosition.y}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'notepad')}
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-1 flex justify-between items-center cursor-move">
            <div className="flex items-center">
              <span className="mr-1 text-lg" aria-hidden="true">📝</span>
              <span className="font-bold">Untitled - Notepad</span>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setIsNotepadMinimized(true)} className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center rounded-sm" aria-label="Minimize">
                <Minus className="w-3 h-3" />
              </button>
              <button onClick={() => setIsNotepadMaximized(!isNotepadMaximized)} className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700 flex items-center justify-center rounded-sm" aria-label="Maximize">
                <Square className="w-3 h-3" />
              </button>
              <button onClick={() => setIsNotepadOpen(false)} className="w-4 h-4 bg-gradient-to-b from-red-400 to-red-500 text-white flex items-center justify-center rounded-sm" aria-label="Close">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="bg-gray-200 p-1">
            <div className="flex text-xs mb-1">
              <span className="mr-2 text-blue-800">File</span>
              <span className="mr-2 text-blue-800">Edit</span>
              <span className="mr-2 text-blue-800">Format</span>
              <span className="mr-2 text-blue-800">View</span>
              <span className="text-blue-800">Help</span>
            </div>
            <textarea 
              className="w-full h-80 p-1 text-sm resize-none focus:outline-none border border-gray-400 text-black"
              value={notepadContent}
              onChange={(e) => setNotepadContent(e.target.value)}
              placeholder="Type here..."
            />
          </div>
        </div>
      )}
      
      {/* Windows XP Start Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center px-1 shadow-md">
        <button className="flex items-center space-x-1 bg-gradient-to-b from-green-400 to-green-600 text-white px-2 py-1 rounded-sm hover:from-green-500 hover:to-green-700 transition-colors">
          <span aria-hidden="true">🪟</span>
          <span className="font-bold">start</span>
        </button>
        {isMsnOpen && (
          <button 
            onClick={() => setIsMsnMinimized(!isMsnMinimized)}
            className={`flex items-center space-x-1 ml-1 px-2 py-1 rounded-sm transition-colors ${isMsnMinimized ? 'bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-b from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900'}`}
            aria-label={isMsnMinimized ? "Restore MSN Messenger" : "Minimize MSN Messenger"}
          >
            <span aria-hidden="true">💬</span>
            <span className="text-white text-xs">Messenger</span>
          </button>
        )}
        {isCalculatorOpen && (
          <button 
            onClick={() => setIsCalculatorMinimized(!isCalculatorMinimized)}
            className={`flex items-center space-x-1 ml-1 px-2 py-1 rounded-sm transition-colors ${isCalculatorMinimized ? 'bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-b from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900'}`}
            aria-label={isCalculatorMinimized ? "Restore Calculator" : "Minimize Calculator"}
          >
            <span aria-hidden="true">🧮</span>
            <span className="text-white text-xs">Calculator</span>
          </button>
        )}
        {isNotepadOpen && (
          <button 
            onClick={() => setIsNotepadMinimized(!isNotepadMinimized)}
            className={`flex items-center space-x-1 ml-1 px-2 py-1 rounded-sm transition-colors ${isNotepadMinimized ? 'bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-b from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900'}`}
            aria-label={isNotepadMinimized ? "Restore Notepad" : "Minimize Notepad"}
          >
            <span aria-hidden="true">📝</span>
            <span className="text-white text-xs">Notepad</span>
          </button>
        )}
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-2">
          <div className="w-px h-6 bg-blue-300"></div>
          <span aria-hidden="true">📶</span>
          <span aria-hidden="true">🔊</span>
          <div className="text-white text-xs">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DesktopIcon({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center text-white text-shadow focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      aria-label={label}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <span className="text-4xl" aria-hidden="true">{icon}</span>
      </div>
      <span className="mt-1 text-xs font-semibold">{label}</span>
    </button>
  )
}