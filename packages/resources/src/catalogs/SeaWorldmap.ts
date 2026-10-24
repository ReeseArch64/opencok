import { createGameplayCatalog, catalogTiles, type GameplayCatalogDocument } from "../catalog.ts";
import { tiles0 } from "./SeaWorldmap.tiles0.ts";
import { tiles1 } from "./SeaWorldmap.tiles1.ts";
import { tiles2 } from "./SeaWorldmap.tiles2.ts";
import { tiles3 } from "./SeaWorldmap.tiles3.ts";
import { tiles4 } from "./SeaWorldmap.tiles4.ts";
import { tiles5 } from "./SeaWorldmap.tiles5.ts";
import { tiles6 } from "./SeaWorldmap.tiles6.ts";
import { tiles7 } from "./SeaWorldmap.tiles7.ts";
import { tiles8 } from "./SeaWorldmap.tiles8.ts";
import { tiles9 } from "./SeaWorldmap.tiles9.ts";
import { tiles10 } from "./SeaWorldmap.tiles10.ts";
import { tiles11 } from "./SeaWorldmap.tiles11.ts";
import { tiles12 } from "./SeaWorldmap.tiles12.ts";
import { tiles13 } from "./SeaWorldmap.tiles13.ts";
import { tiles14 } from "./SeaWorldmap.tiles14.ts";
import { tiles15 } from "./SeaWorldmap.tiles15.ts";
import { tiles16 } from "./SeaWorldmap.tiles16.ts";
import { tiles17 } from "./SeaWorldmap.tiles17.ts";
import { tiles18 } from "./SeaWorldmap.tiles18.ts";
import { tiles19 } from "./SeaWorldmap.tiles19.ts";
import { tiles20 } from "./SeaWorldmap.tiles20.ts";
import { tiles21 } from "./SeaWorldmap.tiles21.ts";
import { tiles22 } from "./SeaWorldmap.tiles22.ts";
import { tiles23 } from "./SeaWorldmap.tiles23.ts";
import { tiles24 } from "./SeaWorldmap.tiles24.ts";
import { tiles25 } from "./SeaWorldmap.tiles25.ts";
import { tiles26 } from "./SeaWorldmap.tiles26.ts";
import { tiles27 } from "./SeaWorldmap.tiles27.ts";
import { tiles28 } from "./SeaWorldmap.tiles28.ts";
import { tiles29 } from "./SeaWorldmap.tiles29.ts";
import { tiles30 } from "./SeaWorldmap.tiles30.ts";
import { tiles31 } from "./SeaWorldmap.tiles31.ts";
import { tiles32 } from "./SeaWorldmap.tiles32.ts";
import { tiles33 } from "./SeaWorldmap.tiles33.ts";
import { tiles34 } from "./SeaWorldmap.tiles34.ts";
import { tiles35 } from "./SeaWorldmap.tiles35.ts";
import { tiles36 } from "./SeaWorldmap.tiles36.ts";
import { tiles37 } from "./SeaWorldmap.tiles37.ts";
import { tiles38 } from "./SeaWorldmap.tiles38.ts";
import { tiles39 } from "./SeaWorldmap.tiles39.ts";
import { tiles40 } from "./SeaWorldmap.tiles40.ts";
import { tiles41 } from "./SeaWorldmap.tiles41.ts";
import { tiles42 } from "./SeaWorldmap.tiles42.ts";
import { tiles43 } from "./SeaWorldmap.tiles43.ts";
import { tiles44 } from "./SeaWorldmap.tiles44.ts";
import { tiles45 } from "./SeaWorldmap.tiles45.ts";
import { tiles46 } from "./SeaWorldmap.tiles46.ts";
import { tiles47 } from "./SeaWorldmap.tiles47.ts";
import { tiles48 } from "./SeaWorldmap.tiles48.ts";
import { tiles49 } from "./SeaWorldmap.tiles49.ts";
import { tiles50 } from "./SeaWorldmap.tiles50.ts";
import { tiles51 } from "./SeaWorldmap.tiles51.ts";
import { tiles52 } from "./SeaWorldmap.tiles52.ts";
import { tiles53 } from "./SeaWorldmap.tiles53.ts";
import { tiles54 } from "./SeaWorldmap.tiles54.ts";
import { tiles55 } from "./SeaWorldmap.tiles55.ts";
import { tiles56 } from "./SeaWorldmap.tiles56.ts";
import { tiles57 } from "./SeaWorldmap.tiles57.ts";
import { tiles58 } from "./SeaWorldmap.tiles58.ts";
import { tiles59 } from "./SeaWorldmap.tiles59.ts";
import { tiles60 } from "./SeaWorldmap.tiles60.ts";
import { tiles61 } from "./SeaWorldmap.tiles61.ts";
import { tiles62 } from "./SeaWorldmap.tiles62.ts";
import { tiles63 } from "./SeaWorldmap.tiles63.ts";
import { tiles64 } from "./SeaWorldmap.tiles64.ts";
import { tiles65 } from "./SeaWorldmap.tiles65.ts";
import { tiles66 } from "./SeaWorldmap.tiles66.ts";
import { tiles67 } from "./SeaWorldmap.tiles67.ts";
import { tiles68 } from "./SeaWorldmap.tiles68.ts";
import { tiles69 } from "./SeaWorldmap.tiles69.ts";
import { tiles70 } from "./SeaWorldmap.tiles70.ts";
import { tiles71 } from "./SeaWorldmap.tiles71.ts";
import { tiles72 } from "./SeaWorldmap.tiles72.ts";
import { tiles73 } from "./SeaWorldmap.tiles73.ts";
import { tiles74 } from "./SeaWorldmap.tiles74.ts";
import { tiles75 } from "./SeaWorldmap.tiles75.ts";
import { tiles76 } from "./SeaWorldmap.tiles76.ts";
import { tiles77 } from "./SeaWorldmap.tiles77.ts";
import { tiles78 } from "./SeaWorldmap.tiles78.ts";
import { tiles79 } from "./SeaWorldmap.tiles79.ts";
import { tiles80 } from "./SeaWorldmap.tiles80.ts";
import { tiles81 } from "./SeaWorldmap.tiles81.ts";
import { tiles82 } from "./SeaWorldmap.tiles82.ts";
import { tiles83 } from "./SeaWorldmap.tiles83.ts";
import { tiles84 } from "./SeaWorldmap.tiles84.ts";
import { tiles85 } from "./SeaWorldmap.tiles85.ts";
import { tiles86 } from "./SeaWorldmap.tiles86.ts";
import { tiles87 } from "./SeaWorldmap.tiles87.ts";
import { tiles88 } from "./SeaWorldmap.tiles88.ts";
import { tiles89 } from "./SeaWorldmap.tiles89.ts";
import { tiles90 } from "./SeaWorldmap.tiles90.ts";
import { tiles91 } from "./SeaWorldmap.tiles91.ts";
import { tiles92 } from "./SeaWorldmap.tiles92.ts";
import { tiles93 } from "./SeaWorldmap.tiles93.ts";
import { tiles94 } from "./SeaWorldmap.tiles94.ts";
import { tiles95 } from "./SeaWorldmap.tiles95.ts";
import { tiles96 } from "./SeaWorldmap.tiles96.ts";
import { tiles97 } from "./SeaWorldmap.tiles97.ts";
import { tiles98 } from "./SeaWorldmap.tiles98.ts";
import { tiles99 } from "./SeaWorldmap.tiles99.ts";
import { tiles100 } from "./SeaWorldmap.tiles100.ts";
import { tiles101 } from "./SeaWorldmap.tiles101.ts";
import { tiles102 } from "./SeaWorldmap.tiles102.ts";
import { tiles103 } from "./SeaWorldmap.tiles103.ts";
import { tiles104 } from "./SeaWorldmap.tiles104.ts";
import { tiles105 } from "./SeaWorldmap.tiles105.ts";
import { tiles106 } from "./SeaWorldmap.tiles106.ts";
import { tiles107 } from "./SeaWorldmap.tiles107.ts";
import { tiles108 } from "./SeaWorldmap.tiles108.ts";
import { tiles109 } from "./SeaWorldmap.tiles109.ts";
import { tiles110 } from "./SeaWorldmap.tiles110.ts";
import { tiles111 } from "./SeaWorldmap.tiles111.ts";
import { tiles112 } from "./SeaWorldmap.tiles112.ts";
import { tiles113 } from "./SeaWorldmap.tiles113.ts";
import { tiles114 } from "./SeaWorldmap.tiles114.ts";
import { tiles115 } from "./SeaWorldmap.tiles115.ts";
import { tiles116 } from "./SeaWorldmap.tiles116.ts";
import { tiles117 } from "./SeaWorldmap.tiles117.ts";
import { tiles118 } from "./SeaWorldmap.tiles118.ts";
import { tiles119 } from "./SeaWorldmap.tiles119.ts";
import { tiles120 } from "./SeaWorldmap.tiles120.ts";
import { tiles121 } from "./SeaWorldmap.tiles121.ts";
import { tiles122 } from "./SeaWorldmap.tiles122.ts";
import { tiles123 } from "./SeaWorldmap.tiles123.ts";
import { tiles124 } from "./SeaWorldmap.tiles124.ts";
import { tiles125 } from "./SeaWorldmap.tiles125.ts";
import { tiles126 } from "./SeaWorldmap.tiles126.ts";
import { tiles127 } from "./SeaWorldmap.tiles127.ts";
import { tiles128 } from "./SeaWorldmap.tiles128.ts";
import { tiles129 } from "./SeaWorldmap.tiles129.ts";
import { tiles130 } from "./SeaWorldmap.tiles130.ts";
import { tiles131 } from "./SeaWorldmap.tiles131.ts";
import { tiles132 } from "./SeaWorldmap.tiles132.ts";
import { tiles133 } from "./SeaWorldmap.tiles133.ts";
import { tiles134 } from "./SeaWorldmap.tiles134.ts";
import { tiles135 } from "./SeaWorldmap.tiles135.ts";
import { tiles136 } from "./SeaWorldmap.tiles136.ts";
import { tiles137 } from "./SeaWorldmap.tiles137.ts";
import { tiles138 } from "./SeaWorldmap.tiles138.ts";
import { tiles139 } from "./SeaWorldmap.tiles139.ts";
import { tiles140 } from "./SeaWorldmap.tiles140.ts";
import { tiles141 } from "./SeaWorldmap.tiles141.ts";
import { tiles142 } from "./SeaWorldmap.tiles142.ts";
import { tiles143 } from "./SeaWorldmap.tiles143.ts";
import { tiles144 } from "./SeaWorldmap.tiles144.ts";
import { tiles145 } from "./SeaWorldmap.tiles145.ts";
import { tiles146 } from "./SeaWorldmap.tiles146.ts";
import { tiles147 } from "./SeaWorldmap.tiles147.ts";
import { tiles148 } from "./SeaWorldmap.tiles148.ts";
import { tiles149 } from "./SeaWorldmap.tiles149.ts";
import { tiles150 } from "./SeaWorldmap.tiles150.ts";
import { tiles151 } from "./SeaWorldmap.tiles151.ts";
import { tiles152 } from "./SeaWorldmap.tiles152.ts";
import { tiles153 } from "./SeaWorldmap.tiles153.ts";
import { tiles154 } from "./SeaWorldmap.tiles154.ts";
import { tiles155 } from "./SeaWorldmap.tiles155.ts";
import { tiles156 } from "./SeaWorldmap.tiles156.ts";
import { tiles157 } from "./SeaWorldmap.tiles157.ts";
import { tiles158 } from "./SeaWorldmap.tiles158.ts";
import { tiles159 } from "./SeaWorldmap.tiles159.ts";
import { tiles160 } from "./SeaWorldmap.tiles160.ts";
import { tiles161 } from "./SeaWorldmap.tiles161.ts";
import { tiles162 } from "./SeaWorldmap.tiles162.ts";
import { tiles163 } from "./SeaWorldmap.tiles163.ts";
import { tiles164 } from "./SeaWorldmap.tiles164.ts";
import { tiles165 } from "./SeaWorldmap.tiles165.ts";
import { tiles166 } from "./SeaWorldmap.tiles166.ts";
import { tiles167 } from "./SeaWorldmap.tiles167.ts";
import { tiles168 } from "./SeaWorldmap.tiles168.ts";
import { tiles169 } from "./SeaWorldmap.tiles169.ts";
import { tiles170 } from "./SeaWorldmap.tiles170.ts";
import { tiles171 } from "./SeaWorldmap.tiles171.ts";
import { tiles172 } from "./SeaWorldmap.tiles172.ts";
import { tiles173 } from "./SeaWorldmap.tiles173.ts";
import { tiles174 } from "./SeaWorldmap.tiles174.ts";
import { tiles175 } from "./SeaWorldmap.tiles175.ts";
import { tiles176 } from "./SeaWorldmap.tiles176.ts";
import { tiles177 } from "./SeaWorldmap.tiles177.ts";
import { tiles178 } from "./SeaWorldmap.tiles178.ts";
import { tiles179 } from "./SeaWorldmap.tiles179.ts";
import { tiles180 } from "./SeaWorldmap.tiles180.ts";
import { tiles181 } from "./SeaWorldmap.tiles181.ts";
import { tiles182 } from "./SeaWorldmap.tiles182.ts";
import { tiles183 } from "./SeaWorldmap.tiles183.ts";
import { tiles184 } from "./SeaWorldmap.tiles184.ts";
import { tiles185 } from "./SeaWorldmap.tiles185.ts";
import { tiles186 } from "./SeaWorldmap.tiles186.ts";
import { tiles187 } from "./SeaWorldmap.tiles187.ts";
import { tiles188 } from "./SeaWorldmap.tiles188.ts";
import { tiles189 } from "./SeaWorldmap.tiles189.ts";
import { tiles190 } from "./SeaWorldmap.tiles190.ts";
import { tiles191 } from "./SeaWorldmap.tiles191.ts";
import { tiles192 } from "./SeaWorldmap.tiles192.ts";
import { tiles193 } from "./SeaWorldmap.tiles193.ts";
import { tiles194 } from "./SeaWorldmap.tiles194.ts";
import { tiles195 } from "./SeaWorldmap.tiles195.ts";
import { tiles196 } from "./SeaWorldmap.tiles196.ts";
import { tiles197 } from "./SeaWorldmap.tiles197.ts";
import { tiles198 } from "./SeaWorldmap.tiles198.ts";
import { tiles199 } from "./SeaWorldmap.tiles199.ts";
import { tiles200 } from "./SeaWorldmap.tiles200.ts";
import { tiles201 } from "./SeaWorldmap.tiles201.ts";
import { tiles202 } from "./SeaWorldmap.tiles202.ts";
import { tiles203 } from "./SeaWorldmap.tiles203.ts";
import { tiles204 } from "./SeaWorldmap.tiles204.ts";
import { tiles205 } from "./SeaWorldmap.tiles205.ts";
import { tiles206 } from "./SeaWorldmap.tiles206.ts";
import { tiles207 } from "./SeaWorldmap.tiles207.ts";
import { tiles208 } from "./SeaWorldmap.tiles208.ts";
import { tiles209 } from "./SeaWorldmap.tiles209.ts";
import { tiles210 } from "./SeaWorldmap.tiles210.ts";
import { tiles211 } from "./SeaWorldmap.tiles211.ts";
import { tiles212 } from "./SeaWorldmap.tiles212.ts";
import { tiles213 } from "./SeaWorldmap.tiles213.ts";
import { tiles214 } from "./SeaWorldmap.tiles214.ts";
import { tiles215 } from "./SeaWorldmap.tiles215.ts";
import { tiles216 } from "./SeaWorldmap.tiles216.ts";
import { tiles217 } from "./SeaWorldmap.tiles217.ts";
import { tiles218 } from "./SeaWorldmap.tiles218.ts";
import { tiles219 } from "./SeaWorldmap.tiles219.ts";
import { tiles220 } from "./SeaWorldmap.tiles220.ts";
import { tiles221 } from "./SeaWorldmap.tiles221.ts";
import { tiles222 } from "./SeaWorldmap.tiles222.ts";
import { tiles223 } from "./SeaWorldmap.tiles223.ts";
import { tiles224 } from "./SeaWorldmap.tiles224.ts";
import { tiles225 } from "./SeaWorldmap.tiles225.ts";
import { tiles226 } from "./SeaWorldmap.tiles226.ts";
import { tiles227 } from "./SeaWorldmap.tiles227.ts";
import { tiles228 } from "./SeaWorldmap.tiles228.ts";
import { tiles229 } from "./SeaWorldmap.tiles229.ts";
import { tiles230 } from "./SeaWorldmap.tiles230.ts";
import { tiles231 } from "./SeaWorldmap.tiles231.ts";
import { tiles232 } from "./SeaWorldmap.tiles232.ts";
import { tiles233 } from "./SeaWorldmap.tiles233.ts";
import { tiles234 } from "./SeaWorldmap.tiles234.ts";
import { tiles235 } from "./SeaWorldmap.tiles235.ts";
import { tiles236 } from "./SeaWorldmap.tiles236.ts";
import { tiles237 } from "./SeaWorldmap.tiles237.ts";
import { tiles238 } from "./SeaWorldmap.tiles238.ts";
import { tiles239 } from "./SeaWorldmap.tiles239.ts";
import { tiles240 } from "./SeaWorldmap.tiles240.ts";
import { tiles241 } from "./SeaWorldmap.tiles241.ts";
import { tiles242 } from "./SeaWorldmap.tiles242.ts";
import { tiles243 } from "./SeaWorldmap.tiles243.ts";
import { tiles244 } from "./SeaWorldmap.tiles244.ts";
import { tiles245 } from "./SeaWorldmap.tiles245.ts";
import { tiles246 } from "./SeaWorldmap.tiles246.ts";
import { tiles247 } from "./SeaWorldmap.tiles247.ts";
import { tiles248 } from "./SeaWorldmap.tiles248.ts";
import { tiles249 } from "./SeaWorldmap.tiles249.ts";
import { tiles250 } from "./SeaWorldmap.tiles250.ts";
import { tiles251 } from "./SeaWorldmap.tiles251.ts";
import { tiles252 } from "./SeaWorldmap.tiles252.ts";
import { tiles253 } from "./SeaWorldmap.tiles253.ts";
import { tiles254 } from "./SeaWorldmap.tiles254.ts";
import { tiles255 } from "./SeaWorldmap.tiles255.ts";
import { tiles256 } from "./SeaWorldmap.tiles256.ts";
import { tiles257 } from "./SeaWorldmap.tiles257.ts";
import { tiles258 } from "./SeaWorldmap.tiles258.ts";
import { tiles259 } from "./SeaWorldmap.tiles259.ts";
import { tiles260 } from "./SeaWorldmap.tiles260.ts";
import { tiles261 } from "./SeaWorldmap.tiles261.ts";
import { tiles262 } from "./SeaWorldmap.tiles262.ts";
import { tiles263 } from "./SeaWorldmap.tiles263.ts";
import { tiles264 } from "./SeaWorldmap.tiles264.ts";
import { tiles265 } from "./SeaWorldmap.tiles265.ts";
import { tiles266 } from "./SeaWorldmap.tiles266.ts";
import { tiles267 } from "./SeaWorldmap.tiles267.ts";
import { tiles268 } from "./SeaWorldmap.tiles268.ts";
import { tiles269 } from "./SeaWorldmap.tiles269.ts";
import { tiles270 } from "./SeaWorldmap.tiles270.ts";
import { tiles271 } from "./SeaWorldmap.tiles271.ts";
import { tiles272 } from "./SeaWorldmap.tiles272.ts";
import { tiles273 } from "./SeaWorldmap.tiles273.ts";
import { tiles274 } from "./SeaWorldmap.tiles274.ts";
import { tiles275 } from "./SeaWorldmap.tiles275.ts";
import { tiles276 } from "./SeaWorldmap.tiles276.ts";
import { tiles277 } from "./SeaWorldmap.tiles277.ts";
import { tiles278 } from "./SeaWorldmap.tiles278.ts";
import { tiles279 } from "./SeaWorldmap.tiles279.ts";
import { tiles280 } from "./SeaWorldmap.tiles280.ts";
import { tiles281 } from "./SeaWorldmap.tiles281.ts";
import { tiles282 } from "./SeaWorldmap.tiles282.ts";
import { tiles283 } from "./SeaWorldmap.tiles283.ts";
import { tiles284 } from "./SeaWorldmap.tiles284.ts";
import { tiles285 } from "./SeaWorldmap.tiles285.ts";
import { tiles286 } from "./SeaWorldmap.tiles286.ts";
import { tiles287 } from "./SeaWorldmap.tiles287.ts";
import { tiles288 } from "./SeaWorldmap.tiles288.ts";
import { tiles289 } from "./SeaWorldmap.tiles289.ts";
export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    { "?xml": [{ "#text": "" }], ":@": { "version": "1.0", "encoding": "UTF-8" } },
    {
      "map": [
        { "#text": "\n " },
        {
          "tileset": [
            { "#text": "\n  " },
            { "image": [], ":@": { "source": "test.png", "width": "2048", "height": "2048" } },
            { "#text": "\n  " },
            {
              "terraintypes": [
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108617" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "space" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "1", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108619" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "stop" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "2", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108617" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "space" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "3", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108621" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "neutrally" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "4", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108622" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "stop" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "5", "tile": "-1" },
                },
                { "#text": "\n  " },
              ],
            },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "0", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "1", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "2", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "3", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "4", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "5", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "6", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "7", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "8", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "9", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "10", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "11", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "12", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "13", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "14", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "15", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "16", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "17", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "18", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "19", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "20", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "21", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "22", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "23", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "24", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "25", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "26", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "27", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "28", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "29", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "30", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "31", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "32", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "33", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "34", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "35", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "36", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "37", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "38", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "39", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "40", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "41", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "42", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "43", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "44", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "45", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "46", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "47", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "48", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "49", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "50", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "51", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "52", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "53", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "54", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "55", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "56", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "57", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "58", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "59", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "60", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "61", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "62", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "63", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "64", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "65", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "66", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "67", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "68", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "69", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "70", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "71", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "72", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "73", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "74", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "75", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "76", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "77", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "78", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "79", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "80", "terrain": "4,4,4,4" } },
            { "#text": "\n " },
          ],
          ":@": {
            "firstgid": "1",
            "name": "test",
            "tilewidth": "256",
            "tileheight": "140",
            "spacing": "6",
            "margin": "4",
          },
        },
        { "#text": "\n " },
        {
          "tileset": [
            { "#text": "\n  " },
            { "image": [], ":@": { "source": "test 2.png", "width": "2048", "height": "2048" } },
            { "#text": "\n  " },
            {
              "terraintypes": [
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108620" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "stop" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "101", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108618" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "space" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "102", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108676" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "space" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "103", "tile": "-1" },
                },
                { "#text": "\n   " },
                {
                  "terrain": [
                    { "#text": "\n    " },
                    {
                      "properties": [
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "name", "value": "108677" } },
                        { "#text": "\n     " },
                        { "property": [], ":@": { "name": "type", "value": "space" } },
                        { "#text": "\n    " },
                      ],
                    },
                    { "#text": "\n   " },
                  ],
                  ":@": { "name": "104", "tile": "-1" },
                },
                { "#text": "\n  " },
              ],
            },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "0", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "1", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "2", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "3", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "4", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "5", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "6", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "7", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "8", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "9", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "10", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "11", "terrain": "0,0,0,0" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "26", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "27", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "28", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "29", "terrain": "1,1,1,1" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "30", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "31", "terrain": "2,2,2,2" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "32", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "33", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "34", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "35", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "36", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "37", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "38", "terrain": "3,3,3,3" } },
            { "#text": "\n  " },
            { "tile": [], ":@": { "id": "39", "terrain": "3,3,3,3" } },
            { "#text": "\n " },
          ],
          ":@": {
            "firstgid": "99",
            "name": "test 2",
            "tilewidth": "256",
            "tileheight": "140",
            "spacing": "6",
            "margin": "4",
          },
        },
        { "#text": "\n " },
        {
          "layer": [
            { "#text": "\n  " },
            {
              "data": [
                ...catalogTiles(tiles0, "\n   "),
                ...catalogTiles(tiles1, "\n   "),
                ...catalogTiles(tiles2, "\n   "),
                ...catalogTiles(tiles3, "\n   "),
                ...catalogTiles(tiles4, "\n   "),
                ...catalogTiles(tiles5, "\n   "),
                ...catalogTiles(tiles6, "\n   "),
                ...catalogTiles(tiles7, "\n   "),
                ...catalogTiles(tiles8, "\n   "),
                ...catalogTiles(tiles9, "\n   "),
                ...catalogTiles(tiles10, "\n   "),
                ...catalogTiles(tiles11, "\n   "),
                ...catalogTiles(tiles12, "\n   "),
                ...catalogTiles(tiles13, "\n   "),
                ...catalogTiles(tiles14, "\n   "),
                ...catalogTiles(tiles15, "\n   "),
                ...catalogTiles(tiles16, "\n   "),
                ...catalogTiles(tiles17, "\n   "),
                ...catalogTiles(tiles18, "\n   "),
                ...catalogTiles(tiles19, "\n   "),
                ...catalogTiles(tiles20, "\n   "),
                ...catalogTiles(tiles21, "\n   "),
                ...catalogTiles(tiles22, "\n   "),
                ...catalogTiles(tiles23, "\n   "),
                ...catalogTiles(tiles24, "\n   "),
                ...catalogTiles(tiles25, "\n   "),
                ...catalogTiles(tiles26, "\n   "),
                ...catalogTiles(tiles27, "\n   "),
                ...catalogTiles(tiles28, "\n   "),
                ...catalogTiles(tiles29, "\n   "),
                ...catalogTiles(tiles30, "\n   "),
                ...catalogTiles(tiles31, "\n   "),
                ...catalogTiles(tiles32, "\n   "),
                ...catalogTiles(tiles33, "\n   "),
                ...catalogTiles(tiles34, "\n   "),
                ...catalogTiles(tiles35, "\n   "),
                ...catalogTiles(tiles36, "\n   "),
                ...catalogTiles(tiles37, "\n   "),
                ...catalogTiles(tiles38, "\n   "),
                ...catalogTiles(tiles39, "\n   "),
                ...catalogTiles(tiles40, "\n   "),
                ...catalogTiles(tiles41, "\n   "),
                ...catalogTiles(tiles42, "\n   "),
                ...catalogTiles(tiles43, "\n   "),
                ...catalogTiles(tiles44, "\n   "),
                ...catalogTiles(tiles45, "\n   "),
                ...catalogTiles(tiles46, "\n   "),
                ...catalogTiles(tiles47, "\n   "),
                ...catalogTiles(tiles48, "\n   "),
                ...catalogTiles(tiles49, "\n   "),
                ...catalogTiles(tiles50, "\n   "),
                ...catalogTiles(tiles51, "\n   "),
                ...catalogTiles(tiles52, "\n   "),
                ...catalogTiles(tiles53, "\n   "),
                ...catalogTiles(tiles54, "\n   "),
                ...catalogTiles(tiles55, "\n   "),
                ...catalogTiles(tiles56, "\n   "),
                ...catalogTiles(tiles57, "\n   "),
                ...catalogTiles(tiles58, "\n   "),
                ...catalogTiles(tiles59, "\n   "),
                ...catalogTiles(tiles60, "\n   "),
                ...catalogTiles(tiles61, "\n   "),
                ...catalogTiles(tiles62, "\n   "),
                ...catalogTiles(tiles63, "\n   "),
                ...catalogTiles(tiles64, "\n   "),
                ...catalogTiles(tiles65, "\n   "),
                ...catalogTiles(tiles66, "\n   "),
                ...catalogTiles(tiles67, "\n   "),
                ...catalogTiles(tiles68, "\n   "),
                ...catalogTiles(tiles69, "\n   "),
                ...catalogTiles(tiles70, "\n   "),
                ...catalogTiles(tiles71, "\n   "),
                ...catalogTiles(tiles72, "\n   "),
                ...catalogTiles(tiles73, "\n   "),
                ...catalogTiles(tiles74, "\n   "),
                ...catalogTiles(tiles75, "\n   "),
                ...catalogTiles(tiles76, "\n   "),
                ...catalogTiles(tiles77, "\n   "),
                ...catalogTiles(tiles78, "\n   "),
                ...catalogTiles(tiles79, "\n   "),
                ...catalogTiles(tiles80, "\n   "),
                ...catalogTiles(tiles81, "\n   "),
                ...catalogTiles(tiles82, "\n   "),
                ...catalogTiles(tiles83, "\n   "),
                ...catalogTiles(tiles84, "\n   "),
                ...catalogTiles(tiles85, "\n   "),
                ...catalogTiles(tiles86, "\n   "),
                ...catalogTiles(tiles87, "\n   "),
                ...catalogTiles(tiles88, "\n   "),
                ...catalogTiles(tiles89, "\n   "),
                ...catalogTiles(tiles90, "\n   "),
                ...catalogTiles(tiles91, "\n   "),
                ...catalogTiles(tiles92, "\n   "),
                ...catalogTiles(tiles93, "\n   "),
                ...catalogTiles(tiles94, "\n   "),
                ...catalogTiles(tiles95, "\n   "),
                ...catalogTiles(tiles96, "\n   "),
                ...catalogTiles(tiles97, "\n   "),
                ...catalogTiles(tiles98, "\n   "),
                ...catalogTiles(tiles99, "\n   "),
                ...catalogTiles(tiles100, "\n   "),
                ...catalogTiles(tiles101, "\n   "),
                ...catalogTiles(tiles102, "\n   "),
                ...catalogTiles(tiles103, "\n   "),
                ...catalogTiles(tiles104, "\n   "),
                ...catalogTiles(tiles105, "\n   "),
                ...catalogTiles(tiles106, "\n   "),
                ...catalogTiles(tiles107, "\n   "),
                ...catalogTiles(tiles108, "\n   "),
                ...catalogTiles(tiles109, "\n   "),
                ...catalogTiles(tiles110, "\n   "),
                ...catalogTiles(tiles111, "\n   "),
                ...catalogTiles(tiles112, "\n   "),
                ...catalogTiles(tiles113, "\n   "),
                ...catalogTiles(tiles114, "\n   "),
                ...catalogTiles(tiles115, "\n   "),
                ...catalogTiles(tiles116, "\n   "),
                ...catalogTiles(tiles117, "\n   "),
                ...catalogTiles(tiles118, "\n   "),
                ...catalogTiles(tiles119, "\n   "),
                ...catalogTiles(tiles120, "\n   "),
                ...catalogTiles(tiles121, "\n   "),
                ...catalogTiles(tiles122, "\n   "),
                ...catalogTiles(tiles123, "\n   "),
                ...catalogTiles(tiles124, "\n   "),
                ...catalogTiles(tiles125, "\n   "),
                ...catalogTiles(tiles126, "\n   "),
                ...catalogTiles(tiles127, "\n   "),
                ...catalogTiles(tiles128, "\n   "),
                ...catalogTiles(tiles129, "\n   "),
                ...catalogTiles(tiles130, "\n   "),
                ...catalogTiles(tiles131, "\n   "),
                ...catalogTiles(tiles132, "\n   "),
                ...catalogTiles(tiles133, "\n   "),
                ...catalogTiles(tiles134, "\n   "),
                ...catalogTiles(tiles135, "\n   "),
                ...catalogTiles(tiles136, "\n   "),
                ...catalogTiles(tiles137, "\n   "),
                ...catalogTiles(tiles138, "\n   "),
                ...catalogTiles(tiles139, "\n   "),
                ...catalogTiles(tiles140, "\n   "),
                ...catalogTiles(tiles141, "\n   "),
                ...catalogTiles(tiles142, "\n   "),
                ...catalogTiles(tiles143, "\n   "),
                ...catalogTiles(tiles144, "\n   "),
                { "#text": "\n  " },
              ],
            },
            { "#text": "\n " },
          ],
          ":@": { "name": "tile", "width": "1201", "height": "1201" },
        },
        { "#text": "\n " },
        {
          "layer": [
            { "#text": "\n  " },
            {
              "data": [
                ...catalogTiles(tiles145, "\n   "),
                ...catalogTiles(tiles146, "\n   "),
                ...catalogTiles(tiles147, "\n   "),
                ...catalogTiles(tiles148, "\n   "),
                ...catalogTiles(tiles149, "\n   "),
                ...catalogTiles(tiles150, "\n   "),
                ...catalogTiles(tiles151, "\n   "),
                ...catalogTiles(tiles152, "\n   "),
                ...catalogTiles(tiles153, "\n   "),
                ...catalogTiles(tiles154, "\n   "),
                ...catalogTiles(tiles155, "\n   "),
                ...catalogTiles(tiles156, "\n   "),
                ...catalogTiles(tiles157, "\n   "),
                ...catalogTiles(tiles158, "\n   "),
                ...catalogTiles(tiles159, "\n   "),
                ...catalogTiles(tiles160, "\n   "),
                ...catalogTiles(tiles161, "\n   "),
                ...catalogTiles(tiles162, "\n   "),
                ...catalogTiles(tiles163, "\n   "),
                ...catalogTiles(tiles164, "\n   "),
                ...catalogTiles(tiles165, "\n   "),
                ...catalogTiles(tiles166, "\n   "),
                ...catalogTiles(tiles167, "\n   "),
                ...catalogTiles(tiles168, "\n   "),
                ...catalogTiles(tiles169, "\n   "),
                ...catalogTiles(tiles170, "\n   "),
                ...catalogTiles(tiles171, "\n   "),
                ...catalogTiles(tiles172, "\n   "),
                ...catalogTiles(tiles173, "\n   "),
                ...catalogTiles(tiles174, "\n   "),
                ...catalogTiles(tiles175, "\n   "),
                ...catalogTiles(tiles176, "\n   "),
                ...catalogTiles(tiles177, "\n   "),
                ...catalogTiles(tiles178, "\n   "),
                ...catalogTiles(tiles179, "\n   "),
                ...catalogTiles(tiles180, "\n   "),
                ...catalogTiles(tiles181, "\n   "),
                ...catalogTiles(tiles182, "\n   "),
                ...catalogTiles(tiles183, "\n   "),
                ...catalogTiles(tiles184, "\n   "),
                ...catalogTiles(tiles185, "\n   "),
                ...catalogTiles(tiles186, "\n   "),
                ...catalogTiles(tiles187, "\n   "),
                ...catalogTiles(tiles188, "\n   "),
                ...catalogTiles(tiles189, "\n   "),
                ...catalogTiles(tiles190, "\n   "),
                ...catalogTiles(tiles191, "\n   "),
                ...catalogTiles(tiles192, "\n   "),
                ...catalogTiles(tiles193, "\n   "),
                ...catalogTiles(tiles194, "\n   "),
                ...catalogTiles(tiles195, "\n   "),
                ...catalogTiles(tiles196, "\n   "),
                ...catalogTiles(tiles197, "\n   "),
                ...catalogTiles(tiles198, "\n   "),
                ...catalogTiles(tiles199, "\n   "),
                ...catalogTiles(tiles200, "\n   "),
                ...catalogTiles(tiles201, "\n   "),
                ...catalogTiles(tiles202, "\n   "),
                ...catalogTiles(tiles203, "\n   "),
                ...catalogTiles(tiles204, "\n   "),
                ...catalogTiles(tiles205, "\n   "),
                ...catalogTiles(tiles206, "\n   "),
                ...catalogTiles(tiles207, "\n   "),
                ...catalogTiles(tiles208, "\n   "),
                ...catalogTiles(tiles209, "\n   "),
                ...catalogTiles(tiles210, "\n   "),
                ...catalogTiles(tiles211, "\n   "),
                ...catalogTiles(tiles212, "\n   "),
                ...catalogTiles(tiles213, "\n   "),
                ...catalogTiles(tiles214, "\n   "),
                ...catalogTiles(tiles215, "\n   "),
                ...catalogTiles(tiles216, "\n   "),
                ...catalogTiles(tiles217, "\n   "),
                ...catalogTiles(tiles218, "\n   "),
                ...catalogTiles(tiles219, "\n   "),
                ...catalogTiles(tiles220, "\n   "),
                ...catalogTiles(tiles221, "\n   "),
                ...catalogTiles(tiles222, "\n   "),
                ...catalogTiles(tiles223, "\n   "),
                ...catalogTiles(tiles224, "\n   "),
                ...catalogTiles(tiles225, "\n   "),
                ...catalogTiles(tiles226, "\n   "),
                ...catalogTiles(tiles227, "\n   "),
                ...catalogTiles(tiles228, "\n   "),
                ...catalogTiles(tiles229, "\n   "),
                ...catalogTiles(tiles230, "\n   "),
                ...catalogTiles(tiles231, "\n   "),
                ...catalogTiles(tiles232, "\n   "),
                ...catalogTiles(tiles233, "\n   "),
                ...catalogTiles(tiles234, "\n   "),
                ...catalogTiles(tiles235, "\n   "),
                ...catalogTiles(tiles236, "\n   "),
                ...catalogTiles(tiles237, "\n   "),
                ...catalogTiles(tiles238, "\n   "),
                ...catalogTiles(tiles239, "\n   "),
                ...catalogTiles(tiles240, "\n   "),
                ...catalogTiles(tiles241, "\n   "),
                ...catalogTiles(tiles242, "\n   "),
                ...catalogTiles(tiles243, "\n   "),
                ...catalogTiles(tiles244, "\n   "),
                ...catalogTiles(tiles245, "\n   "),
                ...catalogTiles(tiles246, "\n   "),
                ...catalogTiles(tiles247, "\n   "),
                ...catalogTiles(tiles248, "\n   "),
                ...catalogTiles(tiles249, "\n   "),
                ...catalogTiles(tiles250, "\n   "),
                ...catalogTiles(tiles251, "\n   "),
                ...catalogTiles(tiles252, "\n   "),
                ...catalogTiles(tiles253, "\n   "),
                ...catalogTiles(tiles254, "\n   "),
                ...catalogTiles(tiles255, "\n   "),
                ...catalogTiles(tiles256, "\n   "),
                ...catalogTiles(tiles257, "\n   "),
                ...catalogTiles(tiles258, "\n   "),
                ...catalogTiles(tiles259, "\n   "),
                ...catalogTiles(tiles260, "\n   "),
                ...catalogTiles(tiles261, "\n   "),
                ...catalogTiles(tiles262, "\n   "),
                ...catalogTiles(tiles263, "\n   "),
                ...catalogTiles(tiles264, "\n   "),
                ...catalogTiles(tiles265, "\n   "),
                ...catalogTiles(tiles266, "\n   "),
                ...catalogTiles(tiles267, "\n   "),
                ...catalogTiles(tiles268, "\n   "),
                ...catalogTiles(tiles269, "\n   "),
                ...catalogTiles(tiles270, "\n   "),
                ...catalogTiles(tiles271, "\n   "),
                ...catalogTiles(tiles272, "\n   "),
                ...catalogTiles(tiles273, "\n   "),
                ...catalogTiles(tiles274, "\n   "),
                ...catalogTiles(tiles275, "\n   "),
                ...catalogTiles(tiles276, "\n   "),
                ...catalogTiles(tiles277, "\n   "),
                ...catalogTiles(tiles278, "\n   "),
                ...catalogTiles(tiles279, "\n   "),
                ...catalogTiles(tiles280, "\n   "),
                ...catalogTiles(tiles281, "\n   "),
                ...catalogTiles(tiles282, "\n   "),
                ...catalogTiles(tiles283, "\n   "),
                ...catalogTiles(tiles284, "\n   "),
                ...catalogTiles(tiles285, "\n   "),
                ...catalogTiles(tiles286, "\n   "),
                ...catalogTiles(tiles287, "\n   "),
                ...catalogTiles(tiles288, "\n   "),
                ...catalogTiles(tiles289, "\n   "),
                { "#text": "\n  " },
              ],
            },
            { "#text": "\n " },
          ],
          ":@": { "name": "ground", "width": "1201", "height": "1201" },
        },
        { "#text": "\n" },
      ],
      ":@": {
        "version": "1.0",
        "orientation": "isometric",
        "width": "1201",
        "height": "1201",
        "tilewidth": "256",
        "tileheight": "128",
      },
    },
  ]);
}
