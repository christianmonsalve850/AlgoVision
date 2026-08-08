export const SERIALIZER = `

def json_advanced_serializer(obj):
    if hasattr(obj, "__qualname__"):
        return {
            "__type__": "callable",
            "name": obj.__qualname__,
            "module": getattr(obj, "__module__", None),
        }

    if hasattr(obj, "__dict__"):
        return {
            "__class__": obj.__class__.__name__,
            "__module__": obj.__class__.__module__,
            "data": obj.__dict__,
        }

    return serialize_fallback_value(obj)


def serialize_fallback_value(obj):
    try:
        return str(obj)
    except Exception:
        return "<Unserializable>"
`