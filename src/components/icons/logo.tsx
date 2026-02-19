import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || 40}
      height={props.height || 40}
      {...props}
    >
      <g fill="hsl(var(--primary))">
        <path d="M149.33 192L128 152.67 106.67 192H58.67l70.16-105.23a1.33 1.33 0 0 1 2.34 0L200.33 192h-51z" />
        <path d="M128 213.33a85.33 85.33 0 1 1 85.33-85.33 85.44 85.44 0 0 1-85.33 85.33zm0-160a74.67 74.67 0 1 0 74.67 74.67A74.75 74.75 0 0 0 128 53.33z" />
      </g>
    </svg>
  );
}
