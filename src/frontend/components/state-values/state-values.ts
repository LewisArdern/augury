import {
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

import {UserActions} from '../../actions/user-actions/user-actions';
import {Highlightable} from '../../utils/highlightable';
import {InputOutput} from '../../utils';
import {functionName} from '../../../utils';
import {
  Path,
  PropertyMetadata,
  Metadata,
} from '../../../tree';

@Component({
  selector: 'bt-state-values',
  template: require('./state-values.html'),
  styles: [require('to-string!./state-values.css')],
})
export class StateValues extends Highlightable {
  @Input() id: string | number;
  @Input() path: Path;
  @Input() inputs: InputOutput;
  @Input() metadata: PropertyMetadata;
  @Input() value;

  private editable: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private userActions: UserActions
  ) {
    super(changeDetector, changes => this.hasChanged(changes));
  }

  private hasChanged(changes) {
    if (changes == null || !changes.hasOwnProperty('value')) {
      return false;
    }

    const oldValue = changes.value.previousValue;
    const newValue = changes.value.currentValue;

    if (oldValue.toString() === 'CD_INIT_VALUE') {
      return false;
    }

    if (typeof oldValue === 'function' && typeof newValue === 'function') {
      return functionName(oldValue) !== functionName(newValue);
    }

    return oldValue !== newValue;
  }

  private get key(): string | number {
    return this.path[this.path.length - 1];
  }

  private onValueChanged(newValue) {
    if (newValue !== this.value) {
      this.userActions.updateProperty(this.path, newValue);
    }
  }
}
