/** The transition that ended is `property` of the element the handler is on, not of something inside it. */
export function endedOn(event: TransitionEvent, property: string): boolean {
  return event.target === event.currentTarget && event.propertyName === property;
}
