declare module '*.css' {}
declare module 'cnchar' {
  const cnchar: {
    stroke(str: string): number;
    spell(str: string, ...args: string[]): string;
  };
  export default cnchar;
}
