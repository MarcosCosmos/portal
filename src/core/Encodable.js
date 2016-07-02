/**
 * Abstract base for 'encodable' types.
 * Encodable types should follow these contraints:
 *  Have a constructor that can be called with zero arguments.
 *  Be capable of generati4     * This is similar to serialisation in a way, but the JSON-format is preferable in these circumstances.
 * Note: the encoded form should NOT be a JSON-formatted string, but suitable for it. e.g. it should not contain information that belongs only to the DOM-tree, such an element or element attributes.
 *  HTML-strings are permitted but not recommended in most circumstances, and should be limited to HTML that is intended to remain static (e.g. paragraph-length text could include <p>s or <br>s,)
 */
class Encodable
{
	constructor()
	{}

	/**
	 * The return of this function should be the initial form of any encoding, which other types can then build on.
	 */
	encode()
	{
		return {};
	}

	/**
	 * Though it may do nothing for now, this should always be called incase changes are made.
	 */
	applyEncoding(encoding) {

	}

	/**
	 * This should probably always be a valid way to construct from an encoding and not need to be overridden, assuming prototype.constructor is kept accurate.
	 */
	static constructFromEncoding(encoding)
	{
		var constructor = types[encoding.constructorName];
		var result = Object.create(constructor.prototype);
		constructor.call(result);
		result.applyEncoding(encoding);
		return result;
	}
}
var types = null;
module.exports =
{
	Encodable,
	setTypes: (_types) => { //this hack will retrospectively attach the full types list and then removes itself from the exports
		types = _types;
		delete module.exports.setTypes;
	}
};
