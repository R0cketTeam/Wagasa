const hl = (userData) => {

  function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    return function () {
      (h = Math.imul(h ^ (h >>> 16), 2246822507)),
        (h = Math.imul(h ^ (h >>> 13), 3266489909));
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function sfc32(a, b, c, d) {
    return function () {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  const tokenId = userData.userData.tokenId
  const walletAddress = userData.userData.walletAddress
  const timestamp = userData.userData.timestamp
  const seed = xmur3(walletAddress + tokenId + timestamp);


  const hl = {
    random: (...args) => {
      let min = 0,
        max = 1;
      if (args.length === 1) max = args[0];
      if (args.length === 2) {
        max = args[1];
        min = args[0];
      }
      const rand = sfc32(seed(), seed(), seed(), seed())();
      return min + (max - min) * rand;
    },
    randomInt: (...args) => {
      if (args.length === 0) args.push(100); //If not upper limit provided then set to [0,100) as safe assumption
      if (args.length === 1) args[0]++;
      if (args.length === 2) args[1]++;
      return Math.floor(hl.random(...args));
    },
    randomBool: (p) => {
      return hl.random() < p;
    },
    randomElement: (array) => {
      return array[hl.randomInt(0, array.length - 1)];
    },
  };

  return hl;
};

export default hl