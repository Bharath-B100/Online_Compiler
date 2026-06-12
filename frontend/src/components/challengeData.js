// All built-in challenges with test cases
export const CHALLENGES = [
  {
    id: 1, title: "Hello, World!", difficulty: "easy", category: "Basics",
    description: "Print exactly `Hello, World!` (with comma and exclamation mark) to standard output.",
    examples: [{ input: "(none)", output: "Hello, World!" }],
    constraints: ["Output must match exactly"],
    testCases: [
      { id: 1, stdin: "", expected: "Hello, World!" },
      { id: 2, stdin: "", expected: "Hello, World!" },
    ],
    starter: {
      javascript: `const lines = require('fs').readFileSync(0,'utf8').trim().split('\\n');\nconsole.log("Hello, World!");`,
      python: `print("Hello, World!")`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
      cpp: `#include<iostream>\nusing namespace std;\nint main(){\n    cout<<"Hello, World!"<<endl;\n    return 0;\n}`,
      c: `#include<stdio.h>\nint main(){\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    }
  },
  {
    id: 2, title: "Sum of Two Numbers", difficulty: "easy", category: "Math",
    description: "Read two integers (one per line) from stdin. Print their sum.",
    examples: [{ input: "3\n5", output: "8" }, { input: "-10\n4", output: "-6" }],
    constraints: ["-10⁹ ≤ a, b ≤ 10⁹"],
    testCases: [
      { id: 1, stdin: "3\n5", expected: "8" },
      { id: 2, stdin: "-10\n4", expected: "-6" },
      { id: 3, stdin: "0\n0", expected: "0" },
      { id: 4, stdin: "1000000000\n-1000000000", expected: "0" },
      { id: 5, stdin: "42\n58", expected: "100" },
    ],
    starter: {
      javascript: `const [a,b] = require('fs').readFileSync(0,'utf8').trim().split('\\n').map(Number);\nconsole.log(a+b);`,
      python: `a=int(input())\nb=int(input())\nprint(a+b)`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        System.out.println(sc.nextLong()+sc.nextLong());\n    }\n}`,
    }
  },
  {
    id: 3, title: "Reverse a String", difficulty: "easy", category: "Strings",
    description: "Read a string from stdin and print it reversed.",
    examples: [{ input: "hello", output: "olleh" }, { input: "CodeForge", output: "egroCedoC" }],
    constraints: ["1 ≤ length ≤ 10⁵"],
    testCases: [
      { id: 1, stdin: "hello", expected: "olleh" },
      { id: 2, stdin: "CodeForge", expected: "egroCedoC" },
      { id: 3, stdin: "a", expected: "a" },
      { id: 4, stdin: "racecar", expected: "racecar" },
      { id: 5, stdin: "abcdefgh", expected: "hgfedcba" },
    ],
    starter: {
      javascript: `const s=require('fs').readFileSync(0,'utf8').trim();\nconsole.log(s.split('').reverse().join(''));`,
      python: `print(input()[::-1])`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        String s=new Scanner(System.in).nextLine();\n        System.out.println(new StringBuilder(s).reverse());\n    }\n}`,
    }
  },
  {
    id: 4, title: "Check Palindrome", difficulty: "easy", category: "Strings",
    description: "Read a string. Print `YES` if it is a palindrome, `NO` otherwise. Case-sensitive.",
    examples: [{ input: "racecar", output: "YES" }, { input: "hello", output: "NO" }],
    constraints: ["1 ≤ length ≤ 10⁵", "Case-sensitive comparison"],
    testCases: [
      { id: 1, stdin: "racecar", expected: "YES" },
      { id: 2, stdin: "hello", expected: "NO" },
      { id: 3, stdin: "a", expected: "YES" },
      { id: 4, stdin: "abba", expected: "YES" },
      { id: 5, stdin: "Racecar", expected: "NO" },
    ],
    starter: {
      javascript: `const s=require('fs').readFileSync(0,'utf8').trim();\nconsole.log(s===s.split('').reverse().join('')?'YES':'NO');`,
      python: `s=input()\nprint('YES' if s==s[::-1] else 'NO')`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        String s=new Scanner(System.in).nextLine();\n        String r=new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(r)?"YES":"NO");\n    }\n}`,
    }
  },
  {
    id: 5, title: "FizzBuzz", difficulty: "easy", category: "Loops",
    description: "Read N from stdin. For numbers 1 to N: print `Fizz` if divisible by 3, `Buzz` if by 5, `FizzBuzz` if by both, else the number.",
    examples: [{ input: "5", output: "1\n2\nFizz\n4\nBuzz" }],
    constraints: ["1 ≤ N ≤ 10⁴"],
    testCases: [
      { id: 1, stdin: "5", expected: "1\n2\nFizz\n4\nBuzz" },
      { id: 2, stdin: "15", expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { id: 3, stdin: "1", expected: "1" },
      { id: 4, stdin: "3", expected: "1\n2\nFizz" },
    ],
    starter: {
      javascript: `const n=+require('fs').readFileSync(0,'utf8').trim();\nfor(let i=1;i<=n;i++) console.log(i%15===0?'FizzBuzz':i%3===0?'Fizz':i%5===0?'Buzz':i);`,
      python: `n=int(input())\nfor i in range(1,n+1):\n    if i%15==0: print('FizzBuzz')\n    elif i%3==0: print('Fizz')\n    elif i%5==0: print('Buzz')\n    else: print(i)`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        int n=new Scanner(System.in).nextInt();\n        for(int i=1;i<=n;i++){\n            if(i%15==0)System.out.println("FizzBuzz");\n            else if(i%3==0)System.out.println("Fizz");\n            else if(i%5==0)System.out.println("Buzz");\n            else System.out.println(i);\n        }\n    }\n}`,
    }
  },
  {
    id: 6, title: "Count Vowels", difficulty: "medium", category: "Strings",
    description: "Read a string. Count and print the number of vowels (a, e, i, o, u — case-insensitive).",
    examples: [{ input: "Hello World", output: "3" }],
    constraints: ["1 ≤ length ≤ 10⁵"],
    testCases: [
      { id: 1, stdin: "Hello World", expected: "3" },
      { id: 2, stdin: "aeiou", expected: "5" },
      { id: 3, stdin: "rhythm", expected: "0" },
      { id: 4, stdin: "AEIOU", expected: "5" },
      { id: 5, stdin: "The quick brown fox", expected: "5" },
    ],
    starter: {
      javascript: `const s=require('fs').readFileSync(0,'utf8').trim();\nconsole.log((s.match(/[aeiou]/gi)||[]).length);`,
      python: `s=input().lower()\nprint(sum(1 for c in s if c in 'aeiou'))`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        String s=new Scanner(System.in).nextLine().toLowerCase();\n        int c=0;\n        for(char ch:s.toCharArray()) if("aeiou".indexOf(ch)>=0) c++;\n        System.out.println(c);\n    }\n}`,
    }
  },
  {
    id: 7, title: "Find Maximum", difficulty: "medium", category: "Arrays",
    description: "First line: N (count). Next N lines: integers. Print the maximum value.",
    examples: [{ input: "4\n3 7 1 9", output: "9" }],
    constraints: ["1 ≤ N ≤ 10⁵", "-10⁹ ≤ each value ≤ 10⁹"],
    testCases: [
      { id: 1, stdin: "4\n3 7 1 9", expected: "9" },
      { id: 2, stdin: "1\n42", expected: "42" },
      { id: 3, stdin: "5\n-1 -5 -3 -2 -4", expected: "-1" },
      { id: 4, stdin: "3\n0 0 0", expected: "0" },
    ],
    starter: {
      javascript: `const lines=require('fs').readFileSync(0,'utf8').trim().split('\\n');\nconst nums=lines[1].split(' ').map(Number);\nconsole.log(Math.max(...nums));`,
      python: `n=int(input())\nnums=list(map(int,input().split()))\nprint(max(nums))`,
      java: `import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        int max=Integer.MIN_VALUE;\n        for(int i=0;i<n;i++){int x=sc.nextInt();if(x>max)max=x;}\n        System.out.println(max);\n    }\n}`,
    }
  },
  {
    id: 8, title: "Fibonacci(N)", difficulty: "medium", category: "Math",
    description: "Read N. Print the Nth Fibonacci number (0-indexed: F(0)=0, F(1)=1, F(2)=1...).",
    examples: [{ input: "10", output: "55" }, { input: "0", output: "0" }],
    constraints: ["0 ≤ N ≤ 50"],
    testCases: [
      { id: 1, stdin: "10", expected: "55" },
      { id: 2, stdin: "0", expected: "0" },
      { id: 3, stdin: "1", expected: "1" },
      { id: 4, stdin: "20", expected: "6765" },
      { id: 5, stdin: "5", expected: "5" },
    ],
    starter: {
      javascript: `const n=+require('fs').readFileSync(0,'utf8').trim();\nlet a=0,b=1;\nfor(let i=0;i<n;i++){[a,b]=[b,a+b];}\nconsole.log(a);`,
      python: `n=int(input())\na,b=0,1\nfor _ in range(n):\n    a,b=b,a+b\nprint(a)`,
      java: `import java.util.Scanner;\npublic class Main{\n    public static void main(String[] a){\n        int n=new Scanner(System.in).nextInt();\n        long x=0,y=1;\n        for(int i=0;i<n;i++){long t=x+y;x=y;y=t;}\n        System.out.println(x);\n    }\n}`,
    }
  },
  {
    id: 9, title: "Anagram Check", difficulty: "medium", category: "Strings",
    description: "Read two strings (one per line). Print `YES` if they are anagrams (same letters, any order, case-insensitive), `NO` otherwise.",
    examples: [{ input: "listen\nsilent", output: "YES" }, { input: "hello\nworld", output: "NO" }],
    constraints: ["1 ≤ length ≤ 10⁵"],
    testCases: [
      { id: 1, stdin: "listen\nsilent", expected: "YES" },
      { id: 2, stdin: "hello\nworld", expected: "NO" },
      { id: 3, stdin: "Astronomer\nMoon starer", expected: "NO" },
      { id: 4, stdin: "abc\ncba", expected: "YES" },
      { id: 5, stdin: "rat\ncar", expected: "NO" },
    ],
    starter: {
      javascript: `const [a,b]=require('fs').readFileSync(0,'utf8').trim().split('\\n');\nconst sort=s=>s.toLowerCase().split('').sort().join('');\nconsole.log(sort(a)===sort(b)?'YES':'NO');`,
      python: `a=input().lower()\nb=input().lower()\nprint('YES' if sorted(a)==sorted(b) else 'NO')`,
      java: `import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        char[] x=sc.nextLine().toLowerCase().toCharArray();\n        char[] y=sc.nextLine().toLowerCase().toCharArray();\n        Arrays.sort(x);Arrays.sort(y);\n        System.out.println(Arrays.equals(x,y)?"YES":"NO");\n    }\n}`,
    }
  },
  {
    id: 10, title: "Two Sum", difficulty: "hard", category: "Algorithms",
    description: "First line: N and target (space-separated). Second line: N integers. Find two indices (0-based) that add up to target. Print them space-separated (smaller index first). Guaranteed one solution.",
    examples: [{ input: "4 9\n2 7 11 15", output: "0 1" }],
    constraints: ["2 ≤ N ≤ 10⁴", "Unique solution exists"],
    testCases: [
      { id: 1, stdin: "4 9\n2 7 11 15", expected: "0 1" },
      { id: 2, stdin: "3 6\n3 2 4", expected: "1 2" },
      { id: 3, stdin: "2 6\n3 3", expected: "0 1" },
      { id: 4, stdin: "5 0\n-3 4 3 90 -1", expected: "0 2" },
    ],
    starter: {
      javascript: `const lines=require('fs').readFileSync(0,'utf8').trim().split('\\n');\nconst [n,target]=lines[0].split(' ').map(Number);\nconst nums=lines[1].split(' ').map(Number);\nconst map={};\nfor(let i=0;i<nums.length;i++){\n  const comp=target-nums[i];\n  if(map[comp]!==undefined){console.log(map[comp]+' '+i);break;}\n  map[nums[i]]=i;\n}`,
      python: `line1=input().split()\ntarget=int(line1[1])\nnums=list(map(int,input().split()))\nseen={}\nfor i,x in enumerate(nums):\n    if target-x in seen:\n        print(seen[target-x],i)\n        break\n    seen[x]=i`,
      java: `import java.util.*;\npublic class Main{\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt(),t=sc.nextInt();\n        int[] arr=new int[n];\n        for(int i=0;i<n;i++)arr[i]=sc.nextInt();\n        Map<Integer,Integer> m=new HashMap<>();\n        for(int i=0;i<n;i++){\n            if(m.containsKey(t-arr[i])){System.out.println(m.get(t-arr[i])+" "+i);return;}\n            m.put(arr[i],i);\n        }\n    }\n}`,
    }
  },
];
