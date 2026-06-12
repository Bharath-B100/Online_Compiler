import React, { useState } from 'react';

const TEMPLATES = [
  // JavaScript
  {
    language: 'javascript',
    name: 'FizzBuzz',
    description: 'Classic FizzBuzz from 1 to 100',
    code: `// FizzBuzz
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
  },
  {
    language: 'javascript',
    name: 'Bubble Sort',
    description: 'Sort an array using bubble sort',
    code: `// Bubble Sort
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];
  return a;
}
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", bubbleSort(arr).join(", "));`,
  },
  {
    language: 'javascript',
    name: 'User Input Demo',
    description: 'Read lines from stdin (set Input below)',
    code: `// Reads stdin line by line
const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const name = lines[0];
const age  = parseInt(lines[1]);
console.log(\`Hello, \${name}! You are \${age} years old.\`);`,
  },

  // Python
  {
    language: 'python',
    name: 'FizzBuzz',
    description: 'Classic FizzBuzz from 1 to 100',
    code: `# FizzBuzz
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
  },
  {
    language: 'python',
    name: 'User Input Demo',
    description: 'Use input() — set stdin below!',
    code: `# User Input Demo
name = input("Enter your name: ")
age  = int(input("Enter your age: "))
print(f"Hello, {name}! In 10 years you will be {age + 10}.")`,
  },
  {
    language: 'python',
    name: 'Prime Numbers',
    description: 'Sieve of Eratosthenes',
    code: `# Sieve of Eratosthenes
def sieve(n):
    primes = [True] * (n + 1)
    primes[0] = primes[1] = False
    for i in range(2, int(n**0.5) + 1):
        if primes[i]:
            for j in range(i*i, n+1, i):
                primes[j] = False
    return [i for i, p in enumerate(primes) if p]

print("Primes up to 50:", sieve(50))`,
  },

  // Java
  {
    language: 'java',
    name: 'FizzBuzz',
    description: 'Classic FizzBuzz from 1 to 100',
    code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            if (i % 15 == 0)      System.out.println("FizzBuzz");
            else if (i % 3 == 0)  System.out.println("Fizz");
            else if (i % 5 == 0)  System.out.println("Buzz");
            else                   System.out.println(i);
        }
    }
}`,
  },
  {
    language: 'java',
    name: 'User Input Demo',
    description: 'Read from stdin using Scanner',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter age: ");
        int age = sc.nextInt();
        System.out.println("Hello, " + name + "! You are " + age + " years old.");
    }
}`,
  },

  // C
  {
    language: 'c',
    name: 'FizzBuzz',
    description: 'Classic FizzBuzz in C',
    code: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 100; i++) {
        if (i % 15 == 0)      printf("FizzBuzz\\n");
        else if (i % 3 == 0)  printf("Fizz\\n");
        else if (i % 5 == 0)  printf("Buzz\\n");
        else                   printf("%d\\n", i);
    }
    return 0;
}`,
  },

  // C++
  {
    language: 'cpp',
    name: 'Sorting Algorithms',
    description: 'std::sort + manual bubble sort',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {64, 34, 25, 12, 22, 11, 90};
    sort(v.begin(), v.end());
    cout << "Sorted: ";
    for (int x : v) cout << x << " ";
    cout << endl;
    return 0;
}`,
  },

  // TypeScript
  {
    language: 'typescript',
    name: 'Typed Functions',
    description: 'TypeScript interfaces and generics',
    code: `interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

function identity<T>(arg: T): T {
  return arg;
}

const user: Person = { name: "Alice", age: 30 };
console.log(greet(user));
console.log(identity<number>(42));`,
  },

  // Go
  {
    language: 'go',
    name: 'Goroutines',
    description: 'Concurrent goroutines with channels',
    code: `package main

import (
    "fmt"
    "sync"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()
    fmt.Printf("Worker %d starting\\n", id)
    // simulate work
    fmt.Printf("Worker %d done\\n", id)
}

func main() {
    var wg sync.WaitGroup
    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }
    wg.Wait()
    fmt.Println("All workers done.")
}`,
  },
];

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', java: '#f89820',
  c: '#a8b9cc', cpp: '#00599c', typescript: '#3178c6',
  go: '#00add8', php: '#8892be', ruby: '#cc342d',
};

const TemplatesModal = ({ currentLanguage, onInsert, onClose }) => {
  const [filter, setFilter] = useState(currentLanguage);

  const filtered = filter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.language === filter);

  const languages = ['all', ...new Set(TEMPLATES.map(t => t.language))];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">📄 Code Templates</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            id="close-templates-btn"
            style={{ fontSize: 16 }}
          >
            ×
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setFilter(lang)}
              style={{
                padding: '4px 12px',
                borderRadius: 99,
                border: `1px solid ${filter === lang ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                background: filter === lang ? 'rgba(124,92,252,0.2)' : 'var(--bg-raised)',
                color: filter === lang ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {lang !== 'all' && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: LANG_COLORS[lang], display: 'inline-block' }} />
              )}
              {lang === 'all' ? 'All' : lang}
            </button>
          ))}
        </div>

        {/* Templates List */}
        <div className="modal-body">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px 0' }}>
              No templates for this language yet
            </div>
          ) : (
            filtered.map((tpl, i) => (
              <div
                key={i}
                className="template-card"
                onClick={() => onInsert(tpl.code, tpl.language)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="template-name">{tpl.name}</div>
                  <span style={{
                    fontSize: 9,
                    padding: '2px 7px',
                    borderRadius: 99,
                    background: 'rgba(124,92,252,0.1)',
                    border: '1px solid var(--border-subtle)',
                    color: LANG_COLORS[tpl.language] || 'var(--accent-primary)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    {tpl.language}
                  </span>
                </div>
                <div className="template-desc">{tpl.description}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
