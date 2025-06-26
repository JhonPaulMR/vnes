class VnesAudioProcessor extends AudioWorkletProcessor {
  // Usaremos um Float32Array para performance, que é o tipo nativo do áudio.
  // Começamos com um tamanho, mas ele pode crescer se necessário.
  _buffer = new Float32Array(8192);
  _bufferSize = 0; // Quantos samples estão de fato no buffer.
  _readIndex = 0;  // De onde devemos começar a ler.

  constructor() {
    super();
    this.port.onmessage = (e) => {
      const data = e.data;
      
      // Se o buffer atual não for grande o suficiente, criamos um novo maior.
      if (this._bufferSize + data.length > this._buffer.length) {
        const newBuffer = new Float32Array(this._buffer.length + data.length);
        newBuffer.set(this._buffer.subarray(this._readIndex, this._bufferSize));
        this._buffer = newBuffer;
        this._bufferSize -= this._readIndex;
        this._readIndex = 0;
      }

      // Adiciona os novos dados ao final do buffer.
      this._buffer.set(data, this._bufferSize);
      this._bufferSize += data.length;
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channel = output[0]; // Assumimos áudio mono no primeiro canal.
    
    // Preenche o buffer de saída do navegador com nossos samples.
    for (let i = 0; i < channel.length; i++) {
      if (this._readIndex < this._bufferSize) {
        // Pega o sample e avança o índice de leitura.
        channel[i] = this._buffer[this._readIndex++];
      } else {
        // Se não tivermos mais samples, preenchemos com silêncio.
        channel[i] = 0;
      }
    }

    // Se lemos todo o buffer, podemos resetá-lo para economizar memória.
    if (this._readIndex >= this._bufferSize) {
        this._readIndex = 0;
        this._bufferSize = 0;
    }

    // Retornar true mantém o processador vivo.
    return true;
  }
}

registerProcessor('vnes-audio-processor', VnesAudioProcessor);