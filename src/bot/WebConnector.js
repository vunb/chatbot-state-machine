/* @flow */

import { ConsoleContext, Session, Connector } from 'bottender';
import WebEvent, { type WebRawEvent } from '../context/WebEvent';

type WebRequestBody = WebRawEvent;

export type WebClient = {
  sendText(text: string): void,
};

type ConstructorOptions = {|
  client?: WebClient,
  fallbackMethods?: boolean,
|};

export default class WebConnector implements Connector<WebRequestBody> {
  _client: WebClient;
  _fallbackMethods: boolean;

  constructor({ client, fallbackMethods }: ConstructorOptions = {}) {
    this._client = client || {
      sendText: text => {
        process.stdout.write(`Bot > ${text}\n`);
      },
    };
    this._fallbackMethods = fallbackMethods || false;
  }

  get platform(): string {
    return 'web';
  }

  get client(): WebClient {
    return this._client;
  }

  getUniqueSessionKey(body: WebRequestBody): string {
    const { sessionID } = body;
    if (sessionID) return sessionID
    return '1';
  }

  async updateSession(session: Session, body: WebRequestBody): Promise<void> {
    if (!session.user) {
      session.user = {
        id: this.getUniqueSessionKey(body),
        name: 'you',
        _updatedAt: new Date().toISOString(),
      };
    }

    Object.freeze(session.user);
    Object.defineProperty(session, 'user', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: session.user,
    });
  }

  mapRequestToEvents(body: WebRequestBody): Array<WebEvent> {
    return [new WebEvent(body)];
  }

  createContext({
    event,
    session,
    initialState,
  }: {
    event: WebEvent,
    session: ?Session,
    initialState: Object,
  }) {
    return new ConsoleContext({
      client: this._client,
      event,
      session,
      initialState,
      fallbackMethods: this._fallbackMethods,
    });
  }
}
