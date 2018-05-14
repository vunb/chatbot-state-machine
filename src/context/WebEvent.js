/* @flow */

import { Event } from 'bottender';

type Message = {
  text: string,
};

export type WebRawEvent = {
  message?: Message,
  payload?: string,
  sessionID: string,
};

export default class WebEvent implements Event {
  _rawEvent: WebRawEvent;

  constructor(rawEvent: WebRawEvent) {
    this._rawEvent = rawEvent;
  }

  /**
   * Underlying raw event from Console.
   *
   */
  get rawEvent(): WebRawEvent {
    return this._rawEvent;
  }

  /**
   * Determine if the event is a message event.
   *
   */
  get isMessage(): boolean {
    return !!this._rawEvent.message;
  }

  /**
   * The message object from Console raw event.
   *
   */
  get message(): ?Message {
    return this._rawEvent.message || null;
  }

  /**
   * Determine if the event is a message event which includes text.
   *
   */
  get isText(): boolean {
    if (this.isMessage) {
      return true;
    }
    return false;
  }

  /**
   * The text string from Console raw event.
   *
   */
  get text(): ?string {
    if (this.isText) {
      return ((this.message: any): Message).text;
    }
    return null;
  }

  /**
   * Determine if the event is a payload event.
   *
   */
  get isPayload(): boolean {
    return !!this._rawEvent.payload;
  }

  /**
   * The payload string from Console raw event.
   *
   */
  get payload(): ?string {
    return this._rawEvent.payload || null;
  }


  /**
   * Determine if the event is a payload event.
   *
   */
  get isSessionID(): boolean {
    return !!this._rawEvent.sessionID;
  }

  /**
   * The payload string from Console raw event.
   *
   */
  get sessionID(): ?string {
    return this._rawEvent.sessionID || null;
  }
}
