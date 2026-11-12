bool isMobileBrowserUserAgent(String agent, int maxTouchPoints) =>
    RegExp(
      r'Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini',
      caseSensitive: false,
    ).hasMatch(agent) ||
    (agent.contains('Macintosh') && maxTouchPoints > 1);
