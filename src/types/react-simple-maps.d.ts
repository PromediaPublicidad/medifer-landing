declare module "react-simple-maps" {
  import * as React from "react";

  export interface ComposableMapProps extends React.SVGProps<SVGSVGElement> {
    projection?: string | ((width: number, height: number) => any);
    projectionConfig?: Record<string, any>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }
  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface GeographiesProps {
    geography: string | Record<string, any>;
    children?: (params: {
      geographies: any[];
      projection: (coord: [number, number]) => [number, number];
    }) => React.ReactNode;
  }
  export const Geographies: React.FC<GeographiesProps>;

  export interface GeographyProps extends React.SVGProps<SVGPathElement> {
    geography: any;
  }
  export const Geography: React.FC<GeographyProps>;

  export interface MarkerProps extends React.SVGProps<SVGPathElement> {
    coordinates: [number, number];
    children?: React.ReactNode;
  }
  export const Marker: React.FC<MarkerProps>;
}