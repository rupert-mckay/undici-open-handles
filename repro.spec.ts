import { MockAgent, setGlobalDispatcher, request } from 'undici'

it('reproduces with globalDispatcher', async () => {
  const mockAgent = new MockAgent()
  setGlobalDispatcher(mockAgent)

  const client = mockAgent.get('http://test.com')

  client.intercept({ path: '/foo' }).reply(200, 'mockResponse')

  const result = await request('http://test.com/foo').then((x) => x.body.text())

  expect(result).toBe('mockResponse')

  await mockAgent.close()
})

it('reproduces with local dispatcher', async () => {
  const mockAgent = new MockAgent()

  const client = mockAgent.get('http://test.com')

  client.intercept({ path: '/foo' }).reply(200, 'mockResponse')

  const result = await request('http://test.com/foo', { dispatcher: mockAgent }).then((x) =>
    x.body.text(),
  )

  expect(result).toBe('mockResponse')

  await mockAgent.close()
})

it('reproduces with body iterator consume', async () => {
  const mockAgent = new MockAgent()

  const client = mockAgent.get('http://test.com')

  client.intercept({ path: '/foo' }).reply(200, 'mockResponse')

  const result = await request('http://test.com/foo', { dispatcher: mockAgent })

  for await (const _data of result.body) {
    console.log(_data)
  }

  expect(true).toBeTruthy()

  await mockAgent.close()
})
