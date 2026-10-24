# Controllers

`GameController` and `WorldController` receive application Services through their
constructors. They expose realm command entry points and delegate execution to
`@opencok/services`, which owns workflows and rule/persistence coordination.
`apps/server` composes the instances; the connection adapter consumes Controllers.

Chat HTTP and WebSocket handler factories remain transport adapters under
`chat-*`. They retain their existing interfaces and authorization behavior.
