import { OllamaClient } from './ollama.js';
import { config } from '../runtime/config.js';
export const DEFAULT_UI_TARS_MODEL = process.env.CO_AGENT_UI_TARS_MODEL || 'ui-tars-2b-q4_K_M';
export const UI_TARS_ACTION_TIMEOUT_MS = Number(process.env.CO_AGENT_UI_TARS_TIMEOUT_MS || 90000);
const prompt = `You are a UI-TARS computer-use agent operating a desktop computer.
Given the user's task, the current screenshot, and action history, output exactly ONE next action.
Use the UI-TARS desktop action format:
Action: click(point='<point>x y</point>')
Action: left_double(point='<point>x y</point>')
Action: right_single(point='<point>x y</point>')
Action: drag(start_point='<point>x y</point>', end_point='<point>x y</point>')
Action: hotkey(key='ctrl l')
Action: type(content='text')
Action: scroll(point='<point>x y</point>', direction='down')
Action: wait()
Action: finished(content='done')
Coordinates are absolute pixels in the supplied screenshot. Return only the Action line. Never invent coordinates outside the screenshot.`;
function point(text){const m=String(text).match(/<point>\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*<\/point>/i);if(!m)return null;return{x:Number(m[1]),y:Number(m[2])}}
function arg(text,name){const re=new RegExp(`${name}\\s*=\\s*['\\\"]([\\s\\S]*?)['\\\"]`);return String(text).match(re)?.[1]??''}
export function parseUiTarsAction(raw,width,height){const s=String(raw||'').replace(/\`\`\`[\s\S]*?\`\`\`/g,m=>m.replace(/\`\`\`/g,'')).trim();const action=(s.match(/Action\s*:\s*([\s\S]+)/i)?.[1]||s).trim();if(/^finished\s*\(/i.test(action))return{type:'finished',content:arg(action,'content')};if(/^wait\s*\(/i.test(action))return{type:'wait'};if(/^type\s*\(/i.test(action))return{type:'type',content:arg(action,'content')};if(/^hotkey\s*\(/i.test(action))return{type:'hotkey',key:arg(action,'key')};if(/^scroll\s*\(/i.test(action)){const p=point(action);const direction=arg(action,'direction')||'down';return p?{type:'scroll',x:p.x,y:p.y,direction}:null}if(/^drag\s*\(/i.test(action)){const a=action.match(/start_point\s*=\s*['\"]?<point>\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*<\/point>/i);const b=action.match(/end_point\s*=\s*['\"]?<point>\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*<\/point>/i);if(a&&b)return{type:'drag',from:{x:Number(a[1]),y:Number(a[2])},to:{x:Number(b[1]),y:Number(b[2])}};return null}const p=point(action);if(!p)return null;if(/^left_double\s*\(/i.test(action))return{type:'left_double',...p};if(/^right_single\s*\(/i.test(action))return{type:'right_single',...p};if(/^click\s*\(/i.test(action))return{type:'click',...p};return null}
export async function nextUiTarsAction({imageBase64,task,history=[],width,height,model=DEFAULT_UI_TARS_MODEL}){const client=new OllamaClient(config().ollama,model);const context=`Task: ${task}\nAction history:\n${history.slice(-8).join('\n')||'(none)'}\nScreenshot dimensions: ${width}x${height}`;const raw=await client.vision([{role:'system',content:prompt},{role:'user',content:context}],imageBase64,{keepAlive:'0s',options:{num_ctx:2048,num_predict:256,temperature:0.05}});const parsed=parseUiTarsAction(raw,width,height);if(!parsed)throw new Error(`UI-TARS returned an unsupported action: ${raw.slice(0,500)}`);return{raw,action:parsed,model}}
