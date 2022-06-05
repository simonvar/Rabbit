import 'dart:developer' as developer;
import 'dart:ui';
import 'package:flutter/services.dart';
import 'package:flame/input.dart';
import 'package:flame/game.dart';
import 'components/player.dart';
import 'helpers/direction.dart';
import 'components/world.dart';
import 'helpers/map_loader.dart';
import 'components/world_hitbox.dart';
import 'package:flutter/widgets.dart';

class RabbitGame extends FlameGame with HasCollisionDetection, KeyboardEvents {
  final World _world = World();
  final Player _player = Player();

  @override
  Future<void> onLoad() async {
    await add(_world);
    await add(_player);
    addWorldCollision();

    _player.position = _world.size / 2;
    camera.followComponent(_player,
        worldBounds: Rect.fromLTRB(0, 0, _world.size.x, _world.size.y));
  }

  @override
  KeyEventResult onKeyEvent(
      RawKeyEvent event, Set<LogicalKeyboardKey> keysPressed) {
    final isKeyDown = event is RawKeyDownEvent;
    Direction? keyDirection = null;

    if (event.logicalKey == LogicalKeyboardKey.keyA) {
      keyDirection = Direction.left;
    } else if (event.logicalKey == LogicalKeyboardKey.keyD) {
      keyDirection = Direction.right;
    } else if (event.logicalKey == LogicalKeyboardKey.keyW) {
      keyDirection = Direction.up;
    } else if (event.logicalKey == LogicalKeyboardKey.keyS) {
      keyDirection = Direction.down;
    }

    if (isKeyDown && keyDirection != null) {
      _player.direction = keyDirection;
    } else if (_player.direction == keyDirection) {
      _player.direction = Direction.none;
    }

    return super.onKeyEvent(event, keysPressed);
  } // @override

  void onJoypadDirectionChanged(Direction direction) {
    _player.direction = direction;
  }

  void addWorldCollision() async {
    final collisionMap = await MapLoader.readRayWorldCollisionMap();
    for (var rect in collisionMap) {
      developer.log('add rect', name: 'game.collisions');
      add(WorldHitbox()
        ..position = Vector2(rect.left, rect.top)
        ..width = rect.width
        ..height = rect.height);
    }
  }
}
