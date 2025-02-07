from typing import MutableMapping


droppable_keys = ["revisions", "textChanges", "image"]


async def delete_keys_from_dict(dictionary, keys) -> dict:
    """
    Recursively deletes keys from a dictionary.

    Args:
        dictionary (dict): The dictionary from which keys will be deleted.
        keys (list): A list of keys to be deleted.

    Returns:
        dict: The modified dictionary with the specified keys removed.
    """
    keys_set = set(keys)

    modified_dict = {}
    for key, value in dictionary.items():
        if key not in keys_set:
            if isinstance(value, MutableMapping):
                modified_dict[key] = await delete_keys_from_dict(value, keys_set)
            elif isinstance(value, list):
                modified_dict[key] = [
                    (
                        await delete_keys_from_dict(item, keys_set)
                        if isinstance(item, MutableMapping)
                        else item
                    )
                    for item in value
                ]
            else:
                modified_dict[key] = value
    return modified_dict


async def clean_document_ai_analysis(analysis: dict) -> dict:
    """
    Clean the Document AI analysis by removing droppable keys.

    Args:
        analysis (dict): The Document AI analysis to be cleaned.

    Returns:
        dict: The cleaned Document AI analysis.
    """
    return await delete_keys_from_dict(analysis, droppable_keys)
