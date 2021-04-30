#name "BlockExtractor"
#author "TMDojo"
#category "Utilities"
#perms "full"

bool g_inCustomMenu = false;

class Block {
    string blockName;
    int blockId;
    int count;
}

vec3 getRealCoords(nat3 coords)
{

    int realX = 32 * coords.x + 16;
    int realY = 8 * coords.y - 60;
    int realZ = 32 * coords.z + 16;

    vec3 coord(realX, realY, realZ);

    return coord;
}

void ExtractBlocks()
{
    dictionary blocksDict;
    array<string> blockNames;
    int outStr;
    
    uint8 blockIndex = 0;
    auto app = GetApp();
    auto membuff = MemoryBuffer(0);

    for (int i = 0; i < app.RootMap.Blocks.Length; i++) {
        auto block = app.RootMap.Blocks[i];

        string name = block.BlockModel.Name;
        uint8 blockNameLen = name.get_Length();
        uint8 dir = block.Direction;
        vec3 coord = getRealCoords(block.Coord);

        membuff.Write(blockNameLen);
        membuff.Write(name);
        membuff.Write(dir);

        membuff.Write(coord.x);
        membuff.Write(coord.y);
        membuff.Write(coord.z);

        auto blockUnits = block.BlockUnits;
        uint8 blockUnitsLen = blockUnits.get_Length();

        membuff.Write(blockUnitsLen);
        for (int i = 0; i < blockUnits.get_Length(); i++) {
            auto unit = blockUnits[i];
            membuff.Write(unit.Offset.x);
            membuff.Write(unit.Offset.y);
            membuff.Write(unit.Offset.z);
        }
    }
    print("Membuff: " + membuff.GetSize());
    membuff.Seek(0);
    Net::HttpPost("http://localhost:3000/save-map-blocks?challengeId=" + app.PlaygroundScript.Map.EdChallengeId, membuff.ReadToBase64(membuff.GetSize()), "application/octet-stream");
    membuff.Resize(0);
}

void RenderMenu()
{
	auto app = cast<CGameManiaPlanet>(GetApp());
	auto menus = cast<CTrackManiaMenus>(app.MenuManager);

	if (UI::BeginMenu("Block Extractor")) {
		if (UI::MenuItem("Extract Blocks", "", false, true)) {
            ExtractBlocks();
		}
		UI::EndMenu();
	}
}

void Main()
{
    print("BlockExtractor: Init");
}
