import{describe,expect,it}from'vitest';import{pageInput}from'./adminApi';
describe('pagination client bounds',()=>{it('caps page size at 100',()=>expect(pageInput(new URLSearchParams('limit=999&offset=-3'))).toEqual({limit:100,offset:0}));it('uses safe defaults',()=>expect(pageInput(new URLSearchParams())).toEqual({limit:25,offset:0}))});
