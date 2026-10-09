import React from 'react';
import {ResponsiveContainer} from 'recharts';
export function ChartContainer({config,children,style,...props}:React.ComponentProps<'div'>&{config:Record<string,any>;children:React.ComponentProps<typeof ResponsiveContainer>['children']}){return <div {...props} style={{width:'100%',height:360,...style}}><ResponsiveContainer initialDimension={{width:320,height:200}}>{children}</ResponsiveContainer></div>}
