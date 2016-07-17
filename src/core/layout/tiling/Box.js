import {Encodable} from '../../Encodable.js';

/**
 * Abstract as it does not have it's own DOMRoot or parent.
 */
class Box extends Encodable
{
    constructor()
    {
        super();
    }

    //mainly for refreshing chats, but needs to be on containers as well in order to cascade down.
    reloadContents() //default method, safe to use but doesn't do anything
    {}

    static lockElms(targetElms)
    {
        targetElms.each(
            function()
            {
                $(this).prop('disabled', true);
                var locks = $(this).data('enableLocks');
                if(isNaN(locks) || locks < 0)
                {
                    locks = 0;
                }
                locks++;
                $(this).data('enableLocks', locks);
            }
        )
    }

    static unlockElms(targetElms)
    {
        targetElms.each(
            function()
            {
                var locks = $(this).data('enableLocks');
                if(isNaN(locks) || locks < 1)
                {
                    locks = 1;
                }
                locks--;
                $(this).data('enableLocks', locks);
                if(locks == 0)
                {
                    $(this).prop('disabled', false);
                }
            }
        )
    }

    destroy()
    {
        this.DOMRoot.remove();
    }

    lockLayout()
    {}

    unlockLayout()
    {}
}

module.exports =
{
    Box
};