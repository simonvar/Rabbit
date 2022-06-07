import 'dart:developer' as developer;
import 'package:flame/components.dart';
import 'package:flame/sprite.dart';
import 'direction.dart';

class Grass extends SpriteComponent with HasGameRef {
  final SpriteSheet sheet;
  final GroundDirection direction;

  Grass({
    required this.sheet,
    required this.direction,
  }) : super(size: Vector2.all(16.0));

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    await _loadSprite();
  }

  Future<void> _loadSprite() async {
    switch (direction) {
      case GroundDirection.center:
        sprite = sheet.getSprite(4, 2);
        break;
      case GroundDirection.top_left:
        sprite = sheet.getSprite(3, 1);
        break;
      case GroundDirection.top:
        sprite = sheet.getSprite(3, 2);
        break;
      case GroundDirection.top_right:
        sprite = sheet.getSprite(3, 3);
        break;
      case GroundDirection.right:
        sprite = sheet.getSprite(4, 3);
        break;
      case GroundDirection.bottom_right:
        sprite = sheet.getSprite(5, 3);
        break;
      case GroundDirection.bottom:
        sprite = sheet.getSprite(5, 2);
        break;
      case GroundDirection.bottom_left:
        sprite = sheet.getSprite(5, 1);
        break;
      case GroundDirection.left:
        sprite = sheet.getSprite(4, 1);
        break;
    }
  }
}
